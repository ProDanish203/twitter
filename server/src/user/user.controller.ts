import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get Current User' })
  @Get('current')
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get('profile')
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get User Profile' })
  async getProfile(@CurrentUser() user: User) {
    return this.userService.getProfile(user);
  }

  @Patch('delete')
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Delete User Profile' })
  async deleteProfile(@CurrentUser() user: User) {
    return this.userService.deleteProfile(user);
  }
}
