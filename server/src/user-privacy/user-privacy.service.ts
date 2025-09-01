import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { throwError } from 'src/common/utils/helpers';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserService } from 'src/user/user.service';
import { UpdateUserAccountTypeDto } from './dto/index.dto';
import { ApiResponse } from 'src/common/types/types';

@Injectable()
export class UserPrivacyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async updateAccountType(
    user: User,
    { accountType }: UpdateUserAccountTypeDto,
  ): Promise<ApiResponse> {
    try {
      await this.prisma.userPrivacy.update({
        where: { userId: user.id },
        data: { accountType },
      });
      return {
        message: 'Account type updated successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update account type',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserPrivacySettings(user: User, dto: any): Promise<ApiResponse> {
    try {
      return {
        message: 'User privacy settings updated successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update user privacy settings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
