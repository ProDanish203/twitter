import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { throwError } from 'src/common/utils/helpers';
import { hashPassword, verifyPassword } from 'src/common/utils/hash';
import { JwtPayload, LoginUserResponse, RegisterUserResponse } from './types';
import { CookieOptions, Response } from 'express';
import { ApiResponse } from 'src/common/types/types';
import { User } from '@prisma/client';

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
      delete user.password;
      delete user.salt;

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
        HttpStatus.INTERNAL_SERVER_ERROR,
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
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
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
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
