import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserNameDto } from './dto/user-common.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'src/common/types/types';

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

  @Patch('update-username')
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Update Username' })
  async updateUsername(
    @CurrentUser() user: User,
    @Body() dto: UpdateUserNameDto,
  ) {
    return this.userService.updateUsername(user, dto);
  }

  @Patch('upload-profile-image')
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Update Username' })
  @UseInterceptors(FileInterceptor('profileImage'))
  async uploadProfileImage(
    @CurrentUser() user: User,
    @UploadedFile() image: MulterFile,
  ) {
    return this.userService.uploadProfileImage(user, image);
  }
}
