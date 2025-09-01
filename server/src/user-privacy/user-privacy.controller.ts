import {
  Controller,
  UseGuards,
  Patch,
  Get,
  Delete,
  Param,
  Query,
  Body,
  Post,
  Put,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserPrivacyService } from './user-privacy.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserAccountTypeDto } from './dto/index.dto';

@UseGuards(AuthGuard)
@ApiTags('User Privacy')
@Controller('user-privacy')
export class UserPrivacyController {
  constructor(private readonly userPrivacyService: UserPrivacyService) {}

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Update User Privacy Settings' })
  @Patch('settings')
  async updateUserPrivacySettings(
    @CurrentUser() user: User,
    @Body() dto: UpdateUserAccountTypeDto,
  ) {
    return await this.userPrivacyService.updateUserPrivacySettings(user, dto);
  }

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Update Account Type' })
  @Patch('account-type')
  async updateAccountType(
    @CurrentUser() user: User,
    @Body() dto: UpdateUserAccountTypeDto,
  ) {
    return await this.userPrivacyService.updateAccountType(user, dto);
  }
}
