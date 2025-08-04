import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import {
  generateSecureOTP,
  generateSecurePassword,
  throwError,
} from 'src/common/utils/helpers';
import {
  generateSecureToken,
  hashPassword,
  verifyPassword,
} from 'src/common/utils/hash';
import {
  GoogleUser,
  JwtPayload,
  LoginUserResponse,
  OtpVerificationResponse,
  RegisterUserResponse,
} from './types';
import { CookieOptions, Request, Response } from 'express';
import { ApiResponse } from 'src/common/types/types';
import { OtpChannel, OtpType, User, UserRole } from '@prisma/client';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import {
  OTP_EXPIRATION_TIME,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_INTERVAL,
  PASSWORD_RESET_TOKEN_EXPIRATION,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW,
} from 'src/common/lib/constants';
import * as bcrypt from 'bcryptjs';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly storageService: StorageService,
  ) {}

  async register(
    res: Response,
    dto: RegisterUserDto,
  ): Promise<ApiResponse<RegisterUserResponse>> {
    try {
      const { email, username, name, password, role } = dto;
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser)
        throw throwError('Email already exists', HttpStatus.BAD_REQUEST);

      const { salt, hash } = hashPassword(password);

      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          name,
          password: hash,
          salt,
          role,
        },
        omit: {
          password: true,
          salt: true,
        },
      });

      if (!user)
        throw throwError(
          'Registration failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token = await this.signJwtTokenToCookies(res, payload);

      return {
        message: 'Registration successful',
        success: true,
        data: { user, token },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(
    res: Response,
    dto: LoginUserDto,
  ): Promise<ApiResponse<LoginUserResponse>> {
    try {
      const { entity, password } = dto;

      const isEmail = entity.includes('@');

      const user = await this.prisma.user.findUnique({
        where: {
          ...(isEmail ? { email: entity } : { username: entity }),
          deletedAt: null,
        },
      });

      if (!user)
        throw throwError('Invalid credentials', HttpStatus.UNAUTHORIZED);

      const isPasswordValid = verifyPassword({
        hash: user.password,
        salt: user.salt,
        password,
      });

      if (!isPasswordValid)
        throw throwError('Invalid credentials', HttpStatus.UNAUTHORIZED);

      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token = await this.signJwtTokenToCookies(res, payload);
      delete user.password;
      delete user.salt;

      return {
        message: 'Login successful',
        success: true,
        data: { user, token },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Login failed',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async signJwtTokenToCookies(
    res: Response,
    payload: JwtPayload,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(payload);

    const cookieOptions: CookieOptions = {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

    res.cookie('token', token, cookieOptions);
    return token;
  }

  async logout(user: User, res: Response): Promise<ApiResponse<null>> {
    try {
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      };

      res.clearCookie('token', cookieOptions);
      return {
        message: 'Logout successful',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Logout failed',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendOtp(req: Request, dto: SendOtpDto): Promise<ApiResponse<string>> {
    try {
      const { identifier, type, otpChannel } = dto;
      const { ipAddress, userAgent } = this.getClientIpAndUserAgent(req);

      await Promise.all([
        this.checkRateLimit(identifier, 'send_otp'),
        this.cleanUpExpiredOtps(identifier, type),
      ]);

      const existingOtp = await this.prisma.otpVerification.findFirst({
        where: {
          identifier,
          type,
          verified: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (existingOtp) {
        await this.updateRateLimit(identifier, 'send_otp');
        return {
          message:
            'OTP already sent. Please wait for the previous OTP to expire.',
          success: true,
        };
      }

      const otp = generateSecureOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);

      const user = await this.findUserByIdentifier(identifier, otpChannel);
      if (!user || !user.id) {
        await this.updateRateLimit(identifier, 'send_otp');
        throw throwError('Account not found', HttpStatus.NOT_FOUND);
      }

      const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);
      const otpRecord = await this.prisma.otpVerification.create({
        data: {
          identifier,
          type,
          code: hashedOtp,
          channel: otpChannel,
          maxAttempts: OTP_MAX_ATTEMPTS,
          expiresAt,
          userId: user?.id || null,
          ipAddress,
          userAgent,
        },
      });

      if (!otpRecord)
        throw throwError(
          'Failed to send OTP',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      await Promise.all([
        this.sendOtpViaChannel(identifier, type, otpChannel, otp),
        this.updateRateLimit(identifier, 'send_otp'),
      ]);

      return {
        message: 'OTP sent successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to send OTP',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resendOtp(req: Request, dto: SendOtpDto) {
    try {
      const { identifier, otpChannel, type } = dto;
      const { ipAddress, userAgent } = this.getClientIpAndUserAgent(req);

      await Promise.all([
        this.checkRateLimit(identifier, 'resend_otp'),
        this.cleanUpExpiredOtps(identifier, type),
      ]);
      // check if there is an existing OTP session, so we can resend the OTP
      const existingOtp = await this.prisma.otpVerification.findFirst({
        where: {
          identifier,
          type,
          verified: false, // OTP must not be used yet
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!existingOtp) {
        await this.updateRateLimit(identifier, 'resend_otp');
        throw throwError(
          'OTP session invalid, please request a new OTP',
          HttpStatus.NOT_FOUND,
        );
      }

      const timeSinceLastOtp = Date.now() - existingOtp.createdAt.getTime();
      // Check if the resend interval has passed
      if (timeSinceLastOtp < OTP_RESEND_INTERVAL) {
        await this.updateRateLimit(identifier, 'resend_otp');
        throw throwError(
          `Please wait ${Math.ceil(
            (OTP_RESEND_INTERVAL - timeSinceLastOtp) / 1000,
          )} seconds before requesting a new OTP`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      const user = await this.findUserByIdentifier(identifier, otpChannel);
      if (!user || !user.id) {
        await this.updateRateLimit(identifier, 'resend_otp');
        throw throwError('Account not found', HttpStatus.NOT_FOUND);
      }

      // Generate a new OTP
      const otp = generateSecureOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);

      const updatedOtpRecord = await this.prisma.otpVerification.update({
        where: { id: existingOtp.id },
        data: {
          code: hashedOtp,
          expiresAt,
          attempts: 0, // Reset attempts
          userId: user.id,
          updatedAt: new Date(),
        },
      });

      if (!updatedOtpRecord)
        throw throwError(
          'Failed to resend OTP',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      await Promise.all([
        this.sendOtpViaChannel(identifier, type, otpChannel, otp),
        this.updateRateLimit(identifier, 'resend_otp'),
      ]);

      return {
        message: 'OTP resent successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to resend OTP',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByIdentifier(
    identifier: string,
    channel?: OtpChannel,
  ): Promise<{ id: string } | null> {
    const isEmail =
      (channel && channel === OtpChannel.EMAIL) || identifier.includes('@');
    return this.prisma.user.findUnique({
      where: {
        ...(isEmail ? { email: identifier } : { phone: identifier }),
        deletedAt: null,
      },
      select: { id: true },
    });
  }

  private async checkRateLimit(
    identifier: string,
    action: string,
  ): Promise<void> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW); // 1 hour window

    const rateLimit = await this.prisma.rateLimit.findUnique({
      where: {
        identifier_action: {
          identifier,
          action,
        },
      },
    });

    if (rateLimit) {
      if (
        rateLimit.windowStart > windowStart &&
        rateLimit.count >= RATE_LIMIT_MAX_REQUESTS
      ) {
        throw throwError(
          `Rate limit exceeded. Please try again after ${Math.ceil(
            (rateLimit.expiresAt.getTime() - now.getTime()) / 1000,
          )} seconds.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
  }

  private async updateRateLimit(
    identifier: string,
    action: string,
  ): Promise<void> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + RATE_LIMIT_WINDOW); // 1 hour expiration

    await this.prisma.rateLimit.upsert({
      where: {
        identifier_action: {
          identifier,
          action,
        },
      },
      update: {
        count: {
          increment: 1,
        },
        expiresAt,
      },
      create: {
        identifier,
        action,
        count: 1,
        windowStart: now,
        expiresAt,
      },
    });
  }

  private async cleanUpExpiredOtps(
    identifier: string,
    type: OtpType,
  ): Promise<void> {
    const now = new Date();
    await this.prisma.otpVerification.deleteMany({
      where: {
        identifier,
        type,
        expiresAt: {
          lt: now,
        },
      },
    });
  }

  private async sendOtpViaChannel(
    identifier: string,
    type: OtpType,
    channel: OtpChannel,
    otp: string,
  ): Promise<void> {
    switch (channel) {
      case OtpChannel.EMAIL: {
        console.log(
          `Sending OTP ${otp} to ${identifier} via Email for ${type}`,
        );
        break;
      }
      case OtpChannel.SMS: {
        console.log(`Sending OTP ${otp} to ${identifier} via SMS for ${type}`);
        break;
      }
    }
  }

  async verifyOtp(
    req: Request,
    dto: VerifyOtpDto,
  ): Promise<ApiResponse<OtpVerificationResponse>> {
    try {
      const { otp, identifier, otpChannel, type } = dto;
      const { ipAddress, userAgent } = this.getClientIpAndUserAgent(req);

      const otpRecord = await this.prisma.otpVerification.findFirst({
        where: {
          identifier,
          type,
          channel: otpChannel,
          verified: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!otpRecord) {
        await this.updateRateLimit(identifier, 'verify_otp');
        throw throwError('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
        await this.updateRateLimit(identifier, 'verify_otp');
        throw throwError(
          'Maximum OTP attempts exceeded. Please request a new OTP.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isValidOtp = await bcrypt.compare(otp, otpRecord.code);

      // Increment attempts
      await this.prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      if (!isValidOtp) {
        await this.updateRateLimit(identifier, 'verify_otp');
        throw throwError('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      // Mark OTP as verified
      await this.prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: {
          verified: true,
        },
      });

      const token = await generateSecureToken();
      // Handle operations after successful verification
      const [operationResult] = await Promise.all([
        this.handleOtpTypeOperations(otpRecord.userId, type, token),
        this.updateRateLimit(identifier, 'verify_otp'),
      ]);

      return {
        message: 'OTP verification successful',
        success: true,
        data: {
          token,
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'OTP verification failed',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async handleOtpTypeOperations(
    userId: string,
    type: OtpType,
    token?: string,
  ): Promise<any> {
    switch (type) {
      case OtpType.EMAIL_VERIFICATION:
        return await this.handleVerifyEmail(userId);
      case OtpType.PASSWORD_RESET:
        return await this.handlePasswordReset(userId, type, token);
      case OtpType.PHONE_VERIFICATION:
        return await this.verifyPhone(userId);
      case OtpType.LOGIN_VERIFICATION:
        break;
      case OtpType.TWO_FACTOR_AUTH:
        break;
      default:
        throw throwError('Unsupported OTP type', HttpStatus.BAD_REQUEST);
    }
  }

  private async handleVerifyEmail(
    userId: string,
  ): Promise<Omit<User, 'password' | 'salt'>> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
      omit: { password: true, salt: true },
    });
  }

  private async verifyPhone(
    userId: string,
  ): Promise<Omit<User, 'password' | 'salt'>> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { isPhoneVerified: true },
      omit: { password: true, salt: true },
    });
  }

  private async handlePasswordReset(
    userId: string,
    type: OtpType,
    token: string,
  ): Promise<Omit<User, 'password' | 'salt'>> {
    // Create a verification token that will be used when updating the password
    if (!token) {
      throw throwError(
        'Token is required for password reset',
        HttpStatus.BAD_REQUEST,
      );
    }
    const verificationToken = await this.prisma.verificationToken.create({
      data: {
        userId,
        token,
        type,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRATION),
      },
    });

    return await this.prisma.user.update({
      where: { id: userId },
      data: { verificationTokens: { connect: { id: verificationToken.id } } },
      omit: { password: true, salt: true },
    });
  }

  private getClientIpAndUserAgent(req: Request): {
    ipAddress: string;
    userAgent: string;
  } {
    const ipAddress = '';
    // req.headers['x-forwarded-for']?.[0]?.split(',')[0] ||
    // req.headers['x-real-ip'] ||
    // null;
    const userAgent = req.headers['user-agent'] || '';
    return { ipAddress, userAgent };
  }

  async cleanupTokensAndOtps(): Promise<ApiResponse> {
    try {
      const now = new Date();

      const [expiredOtps, expiredTokens, expiredRateLimits] = await Promise.all(
        [
          await this.prisma.otpVerification.deleteMany({
            where: {
              expiresAt: {
                lt: now,
              },
            },
          }),
          this.prisma.verificationToken.deleteMany({
            where: {
              expiresAt: {
                lt: now,
              },
            },
          }),
          this.prisma.rateLimit.deleteMany({
            where: {
              expiresAt: {
                lt: now,
              },
            },
          }),
        ],
      );

      return {
        message: 'Cleanup successful',
        success: true,
        data: {
          expiredOtps: expiredOtps.count,
          expiredTokens: expiredTokens.count,
          expiredRateLimits: expiredRateLimits.count,
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to clean up tokens and OTPs',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgotPassword(
    req: Request,
    { identifier }: ForgotPasswordDto,
  ): Promise<ApiResponse> {
    try {
      const user = await this.findUserByIdentifier(identifier);
      if (!user) throw throwError('User not found', HttpStatus.BAD_REQUEST);

      const otpResponse = await this.sendOtp(req, {
        identifier,
        type: OtpType.PASSWORD_RESET,
        otpChannel: OtpChannel.EMAIL,
      });
      if (!otpResponse.success) {
        throw throwError(
          'Failed to send OTP for password reset',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: 'Forgot password request processed successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to process forgot password request',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword({
    newPassword,
    resetToken,
  }: ResetPasswordDto): Promise<ApiResponse> {
    try {
      const verificationToken = await this.prisma.verificationToken.findFirst({
        where: {
          token: resetToken,
          type: OtpType.PASSWORD_RESET,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!verificationToken)
        throw throwError(
          'Invalid or expired reset token',
          HttpStatus.BAD_REQUEST,
        );

      const { hash, salt } = hashPassword(newPassword);

      await Promise.all([
        this.prisma.user.update({
          where: { id: verificationToken.userId },
          data: {
            password: hash,
            salt: salt,
          },
        }),
        // Remove the verification token after successful reset
        this.prisma.verificationToken.delete({
          where: { id: verificationToken.id },
        }),
      ]);

      return {
        message: 'Password reset successful',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to reset password',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(req: Request, user: User): Promise<ApiResponse> {
    try {
      if (user.isEmailVerified)
        return {
          message: 'Email already verified',
          success: true,
        };

      await this.sendOtp(req, {
        identifier: user.email,
        type: OtpType.EMAIL_VERIFICATION,
        otpChannel: OtpChannel.EMAIL,
      });

      return {
        message: 'Verification email sent successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to verify email',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerGoogleUser(googleUser: GoogleUser): Promise<User> {
    try {
      const password = generateSecurePassword();
      const { hash, salt } = hashPassword(password);
      const user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          role: UserRole.USER,
          loginProvider: 'GOOGLE',
          providerId: googleUser.providerId,
          // Random password for Google users
          password: hash,
          salt,
        },
      });

      if (!user)
        throw throwError(
          'Failed to register Google user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      return user;
    } catch (err) {
      throw throwError(
        err.message || 'Failed to register Google user',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signinWithGoogle(
    req: Request,
    res: Response,
  ): Promise<ApiResponse<LoginUserResponse>> {
    try {
      const googleUser = req.user as unknown as GoogleUser; // Assuming user is set by GoogleOAuthGuard
      if (
        !googleUser ||
        !googleUser.email ||
        !googleUser.providerId ||
        !googleUser.name
      )
        throw throwError('Google sign-in failed', HttpStatus.UNAUTHORIZED);

      let user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      // Register the user if they don't exist
      if (!user) {
        user = await this.registerGoogleUser(googleUser);
      }

      if (user.deletedAt) {
        throw throwError('User account is deleted', HttpStatus.FORBIDDEN);
      }

      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token = await this.signJwtTokenToCookies(res, payload);
      delete user.password;
      delete user.salt;

      return {
        message: 'Google sign-in successful',
        success: true,
        data: {
          user,
          token,
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to sign in with Google',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
