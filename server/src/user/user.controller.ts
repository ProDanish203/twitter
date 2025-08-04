import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

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

  @Patch('profile/update')
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Update User Profile' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateData: UpdateUserProfileDto,
  ) {
    return this.userService.updateProfile(user, updateData);
  }

  @Patch('delete')
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Delete User Profile' })
  async deleteProfile(@CurrentUser() user: User) {
    return this.userService.deleteProfile(user);
  }
}
