import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiProperty({
    title: 'Register User',
    type: RegisterUserDto,
  })
  async register(@Res() response: Response, @Body() dto: RegisterUserDto) {
    return await this.authService.register(response, dto);
  }

  @Post('login')
  @ApiProperty({
    title: 'Login User',
    type: RegisterUserDto,
  })
  async login(@Res() response: Response, @Body() dto: LoginUserDto) {
    return await this.authService.login(response, dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Logout User' })
  async logout(@CurrentUser() user: User, @Res() response: Response) {
    return await this.authService.logout(user, response);
  }
}
