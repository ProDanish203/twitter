import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserNameDto } from './dto/user-common.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile, QueryParams } from 'src/common/types/types';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.ADMIN)
  @ApiProperty({ title: 'Get All Users' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'filter', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @Get('all')
  async getAllUsers(@CurrentUser() user: User, @Query() query: QueryParams) {
    return await this.userService.getAllUsers(user, query);
  }

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
  @ApiProperty({ title: 'Update User Profile', type: UpdateUserProfileDto })
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
  @ApiProperty({ title: 'Update Username', type: UpdateUserNameDto })
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
