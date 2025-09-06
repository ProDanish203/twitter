import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  CheckUserExistsDto,
  CheckUsernameDto,
  LoginUserDto,
  RegisterUserDto,
} from './dto/auth.dto';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Cron } from '@nestjs/schedule';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { GoogleOAuthGuard } from 'src/common/guards/google-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiProperty({
    title: 'Register User',
    type: RegisterUserDto,
  })
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: RegisterUserDto,
  ) {
    return await this.authService.register(response, dto);
  }

  @Post('login')
  @ApiProperty({
    title: 'Login User',
    type: RegisterUserDto,
  })
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: LoginUserDto,
  ) {
    return await this.authService.login(response, dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Logout User' })
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(user, response);
  }

  @Post('forgot-password')
  @ApiProperty({ title: 'Forgot Password', type: ForgotPasswordDto })
  async forgotPassword(
    @Req() request: Request,
    @Body() dto: ForgotPasswordDto,
  ) {
    return await this.authService.forgotPassword(request, dto);
  }

  @Post('reset-password')
  @ApiProperty({ title: 'Reset Password', type: ResetPasswordDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  @Put('verify-email')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Verify Email' })
  async verifyEmail(@Req() request: Request, @CurrentUser() user: User) {
    return await this.authService.verifyEmail(request, user);
  }

  @Post('send-otp')
  @ApiProperty({ title: 'Send OTP', type: SendOtpDto })
  async sendOtp(@Req() request: Request, @Body() dto: SendOtpDto) {
    return await this.authService.sendOtp(request, dto);
  }

  @Post('resend-otp')
  @ApiProperty({ title: 'Resend OTP', type: SendOtpDto })
  async resendOtp(@Req() request: Request, @Body() dto: SendOtpDto) {
    return await this.authService.resendOtp(request, dto);
  }

  @Post('verify-otp')
  @ApiProperty({ title: 'Verify OTP', type: VerifyOtpDto })
  async verifyOtp(@Req() request: Request, @Body() dto: VerifyOtpDto) {
    return await this.authService.verifyOtp(request, dto);
  }

  @Cron('0 0 * * *') // Runs every day at midnight
  @ApiOperation({ summary: 'Cleanup Tokens and OTPs' })
  async cleanupTokensAndOtps() {
    return await this.authService.cleanupTokensAndOtps();
  }

  @Get('check-username')
  @ApiQuery({ name: 'username', type: String, required: true })
  async checkUserrname(@Query('username') username: string) {
    return await this.authService.checkUsername(username);
  }

  @Post('user-exists')
  @ApiProperty({
    title: 'Check User Exists',
    type: CheckUserExistsDto,
    required: true,
  })
  async checkUserExists(@Body() dto: CheckUserExistsDto) {
    return await this.authService.checkUsername(dto.identifier);
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  async googleAuth(@Req() request: Request) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth Callback' })
  async googleAuthCallback(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.signinWithGoogle(request, response);
    return response.redirect(`${process.env.GOOGLE_REDIRECT_URL_CLIENT_REACT}`);
  }
}
