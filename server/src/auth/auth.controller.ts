import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Cron } from '@nestjs/schedule';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { VerifyOtpDto } from './dto/otp.dto';

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
  @ApiProperty({ title: 'Forgot Password' })
  async forgotPassword(
    @Req() request: Request,
    @Body() dto: ForgotPasswordDto,
  ) {
    return await this.authService.forgotPassword(request, dto);
  }

  @Post('reset-password')
  @ApiProperty({ title: 'Reset Password' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  @Post('verify-otp')
  @ApiProperty({ title: 'Verify OTP' })
  async verifyOtp(@Req() request: Request, @Body() dto: VerifyOtpDto) {
    return await this.authService.verifyOtp(request, dto);
  }

  @Cron('0 0 * * *') // Runs every day at midnight
  @ApiOperation({ summary: 'Cleanup Tokens and OTPs' })
  async cleanupTokensAndOtps() {
    return await this.authService.cleanupTokensAndOtps();
  }
}
