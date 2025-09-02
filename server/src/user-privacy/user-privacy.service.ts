import { HttpStatus, Injectable } from '@nestjs/common';
import { User, UserPrivacy } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { throwError } from 'src/common/utils/helpers';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserService } from 'src/user/user.service';
import { UpdateUserAccountTypeDto } from './dto/index.dto';
import { ApiResponse } from 'src/common/types/types';
import { UpdateUserPrivacySettingsDto } from './dto/update-privacy-settings.dto';
import {
  ActivitySettingsFields,
  ContentFilteringFields,
  ContentVisibilityFields,
  InteractionSettingsFields,
  ProfileVisibilityFields,
  UserPrivacySettingFields,
} from './types';

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

  async updateUserPrivacySettings(
    user: User,
    dto: UpdateUserPrivacySettingsDto,
  ): Promise<ApiResponse<UserPrivacy>> {
    try {
      const updateData = { ...dto };
      const contentVisibilityFields: ContentVisibilityFields[] = [
        'likesVisible',
        'repliesVisible',
        'mediaVisible',
      ];

      const profileVisibilityFields: ProfileVisibilityFields[] = [
        'avatarVisible',
        'coverVisible',
        'emailVisible',
        'phoneVisible',
      ];

      const interactionFields: InteractionSettingsFields[] = [
        'allowTagging',
        'allowMentions',
        'allowDirectMessages',
      ];

      const activityFields: ActivitySettingsFields[] = [
        'showOnlineStatus',
        'showLastActiveTime',
        'showTypingIndicator',
        'showReadReceipts',
      ];

      const contentFilteringFields: ContentFilteringFields[] = [
        'filterSensitiveContent',
        'filterSpamContent',
        'filterOffensiveContent',
      ];

      const fields = [
        ...contentVisibilityFields,
        ...profileVisibilityFields,
        ...interactionFields,
        ...activityFields,
        ...contentFilteringFields,
      ];

      fields.forEach((field) => {
        updateData[field] = dto[field as keyof UpdateUserPrivacySettingsDto];
      });

      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined),
      ) as Partial<UserPrivacySettingFields>;

      const userPrivacySettings = await this.prisma.userPrivacy.update({
        where: { userId: user.id },
        data: cleanUpdateData,
      });

      return {
        message: 'User privacy settings updated successfully',
        success: true,
        data: userPrivacySettings,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update user privacy settings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserPrivacySettings(user: User): Promise<ApiResponse<UserPrivacy>> {
    try {
      let userPrivacySettings = await this.prisma.userPrivacy.findUnique({
        where: { userId: user.id },
      });

      if (!userPrivacySettings) {
        userPrivacySettings = await this.prisma.userPrivacy.create({
          data: {
            userId: user.id,
          },
        });
      }

      return {
        message: 'User privacy settings retrieved successfully',
        success: true,
        data: userPrivacySettings,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get user privacy settings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetUserPrivacySettings(
    user: User,
  ): Promise<ApiResponse<UserPrivacy>> {
    try {
      await this.prisma.userPrivacy.delete({
        where: {
          userId: user.id,
        },
      });

      const userPrivacySettings = await this.prisma.userPrivacy.create({
        data: { userId: user.id },
      });

      return {
        message: 'User privacy settings reset successfully',
        success: true,
        data: userPrivacySettings,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to reset user privacy settings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async blockUser(user: User, targetUserId: string): Promise<ApiResponse> {
    try {
      return {
        message: ``,
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to block user',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async unblockUser(user: User, targetUserId: string): Promise<ApiResponse> {
    try {
      return {
        message: ``,
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to unblock user',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async reportUser(user: User, targetUserId: string): Promise<ApiResponse> {
    try {
      return {
        message: ``,
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to report user',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restrictUser(user: User, targetUserId: string): Promise<ApiResponse> {
    try {
      return {
        message: ``,
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to report user',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async manageOffensiveKeywords(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to manage offensive keywords',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
