import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from 'src/user/user.service';
import { throwError } from 'src/common/utils/helpers';
import {
  NotificationSettings,
  NotificationStatus,
  NotificationType,
  Prisma,
  User,
} from '@prisma/client';
import { ApiResponse, QueryParams } from 'src/common/types/types';
import { NOTIFICATION_MEDIUM } from './types/index';
import {
  CreateNotificationPayload,
  EmailNotificationFields,
  GetAllNotificationsResponse,
  InAppNotificationFields,
  NotificationSettingFields,
  PushNotificationFields,
} from './types';
import { minimalUserSelect } from 'src/user/queries';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getAllNotifications(
    user: User,
    query?: QueryParams,
  ): Promise<ApiResponse<GetAllNotificationsResponse>> {
    try {
      const { page = 1, limit = 30 } = query;

      const where: Prisma.NotificationWhereInput = {
        userId: user.id,
      };
      const skip = (Number(page) - 1) * Number(limit);
      const [notifications, totalCount] = await Promise.all([
        this.prisma.notification.findMany({
          where,
          include: {
            actor: {
              select: minimalUserSelect,
            },
          },
          skip,
          take: Number(limit),
        }),
        this.prisma.notification.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      const pagination = {
        totalCount,
        totalPages,
        page: Number(page),
        limit: Number(limit),
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      };

      if (notifications.length === 0) {
        return {
          message: 'Notifications retrieved successfully',
          success: true,
          data: {
            notifications: [],
            pagination,
          },
        };
      }

      // Early return if no actorId is present, without populating the actors
      if (!notifications.every((notification) => notification.actorId)) {
        return {
          message: 'Notifications retrieved successfully',
          success: true,
          data: {
            notifications,
            pagination,
          },
        };
      }

      // Populate the actors
      const populatedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          if (notification.actor) {
            const actor = await this.userService.populateUser(
              notification.actor,
            );
            if (actor)
              return {
                ...notification,
                actor,
              };
          }
          return notification;
        }),
      );

      return {
        message: 'Notifications retrieved successfully',
        success: true,
        data: {
          notifications: populatedNotifications,
          pagination,
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get notifications',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNotificationSettings(
    user: User,
  ): Promise<ApiResponse<NotificationSettings>> {
    try {
      let userNotificaitonSettings =
        await this.prisma.notificationSettings.findUnique({
          where: {
            userId: user.id,
          },
        });

      if (!userNotificaitonSettings) {
        userNotificaitonSettings =
          await this.prisma.notificationSettings.create({
            data: {
              userId: user.id,
            },
          });
      }

      return {
        message: 'Notification settings retrieved successfully',
        success: true,
        data: userNotificaitonSettings,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get notification settings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUnreadCount(user: User): Promise<ApiResponse<number>> {
    try {
      const count = await this.prisma.notification.count({
        where: {
          userId: user.id,
          status: NotificationStatus.UNREAD,
        },
      });
      return {
        message: 'Unread notifications count retrieved successfully',
        success: true,
        data: count,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get unread notifications count',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateNotificationSettings(
    user: User,
    dto: UpdateNotificationSettingsDto,
  ): Promise<ApiResponse<NotificationSettings>> {
    try {
      const updateData = { ...dto };

      const emailFields: Exclude<
        EmailNotificationFields,
        'emailEnabled' | 'emailSystem'
      >[] = [
        'emailComments',
        'emailFollows',
        'emailLikes',
        'emailMentions',
        'emailPosts',
        'emailReplies',
        'emailReposts',
        'emailFollowRequests',
        'emailInfo',
        'emailPostInteractions',
      ];

      const inAppFields: Exclude<
        InAppNotificationFields,
        'inAppEnabled' | 'inAppSystem'
      >[] = [
        'inAppComments',
        'inAppFollows',
        'inAppLikes',
        'inAppMentions',
        'inAppPosts',
        'inAppReplies',
        'inAppReposts',
        'inAppFollowRequests',
        'inAppInfo',
        'inAppPostInteractions',
      ];

      const pushFields: Exclude<
        PushNotificationFields,
        'pushEnabled' | 'pushSystem'
      >[] = [
        'pushComments',
        'pushFollows',
        'pushLikes',
        'pushMentions',
        'pushPosts',
        'pushReplies',
        'pushReposts',
        'pushFollowRequests',
        'pushInfo',
        'pushPostInteractions',
      ];

      if (updateData.emailEnabled === false) {
        emailFields.forEach((field) => {
          updateData[field] = false;
        });
      }

      if (updateData.inAppEnabled === false) {
        inAppFields.forEach((field) => {
          updateData[field] = false;
        });
      }

      if (updateData.pushEnabled === false) {
        pushFields.forEach((field) => {
          updateData[field] = false;
        });
      }

      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined),
      ) as Partial<NotificationSettingFields>;

      const updatedSettings = await this.prisma.notificationSettings.update({
        where: {
          userId: user.id,
        },
        data: {
          ...cleanUpdateData,
        },
      });

      return {
        message: 'Notification settings updated successfully',
        success: true,
        data: updatedSettings,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update notification settings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async markAllAsRead(user: User): Promise<ApiResponse> {
    try {
      await Promise.all([
        this.prisma.notification.updateMany({
          where: {
            userId: user.id,
            status: NotificationStatus.UNREAD,
          },
          data: {
            status: NotificationStatus.READ,
            readAt: new Date(),
          },
        }),
        this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            hasNotifications: false,
          },
        }),
      ]);

      return {
        message: 'All notifications marked as read',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to mark all notifications as read',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async markAsRead(user: User, notificationId: string): Promise<ApiResponse> {
    try {
      await this.prisma.notification.update({
        where: {
          userId: user.id,
          id: notificationId,
        },
        data: {
          status: NotificationStatus.READ,
          readAt: new Date(),
        },
      });

      const unreadCount = await this.prisma.notification.count({
        where: {
          userId: user.id,
          status: NotificationStatus.UNREAD,
        },
      });

      if (unreadCount === 0)
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            hasNotifications: false,
          },
        });

      return {
        message: 'Notification marked as read',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to mark notification as read',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async clearAllNotifications(user: User): Promise<ApiResponse> {
    try {
      await Promise.all([
        this.prisma.notification.deleteMany({
          where: {
            userId: user.id,
          },
        }),
        this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            hasNotifications: false,
          },
        }),
      ]);

      return {
        message: 'All notifications cleared successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to clear all notifications',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteNotification(
    user: User,
    notificationId: string,
  ): Promise<ApiResponse> {
    try {
      await this.prisma.notification.delete({
        where: {
          userId: user.id,
          id: notificationId,
        },
      });

      return {
        message: 'Notification deleted successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to delete notification',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Internal Services
  async createNotification(
    toUserId: string,
    data: CreateNotificationPayload,
    medium: NOTIFICATION_MEDIUM = NOTIFICATION_MEDIUM.IN_APP,
  ): Promise<boolean> {
    try {
      const { type } = data;
      const isEnabled = await this._checkNotificationTypeEnabled(
        toUserId,
        type,
        medium,
      );
      if (!isEnabled) return false;

      if (medium === NOTIFICATION_MEDIUM.IN_APP) {
        await this.prisma.notification.create({
          data: {
            userId: toUserId,
            ...data,
          },
        });
        return true;
      }
    } catch (err) {
      console.error('Failed to create notification:', err.message);
      return false;
    }
  }

  private async _checkNotificationTypeEnabled(
    userId: string,
    type: NotificationType,
    medium: NOTIFICATION_MEDIUM = NOTIFICATION_MEDIUM.IN_APP,
  ): Promise<boolean> {
    try {
      // Check if the notification type is enabled for the user
      const userNotificationSettings =
        await this.prisma.notificationSettings.findUnique({
          where: { userId },
        });

      if (!userNotificationSettings) return true;

      const prefix =
        medium === NOTIFICATION_MEDIUM.EMAIL
          ? 'email'
          : medium === NOTIFICATION_MEDIUM.PUSH
            ? 'push'
            : 'inApp';

      switch (type) {
        case 'FOLLOW_REQUEST':
          return userNotificationSettings[`${prefix}FollowRequests`];
        case 'FOLLOW':
          return userNotificationSettings[`${prefix}Follows`];
        case 'LIKE':
          return userNotificationSettings[`${prefix}Likes`];
        case 'COMMENT':
          return userNotificationSettings[`${prefix}Comments`];
        case 'REPLY':
          return userNotificationSettings[`${prefix}Replies`];
        case 'MENTION':
          return userNotificationSettings[`${prefix}Mentions`];
        case 'DIRECT_MESSAGE':
          return userNotificationSettings[`${prefix}DirectMessages`];
        case 'POST':
          return userNotificationSettings[`${prefix}Posts`];
        case 'POST_INTERACTION':
          return userNotificationSettings[`${prefix}PostInteractions`];
        case 'REPOST':
          return userNotificationSettings[`${prefix}Reposts`];
        case 'SYSTEM':
          return true;
        case 'INFO':
          return true;
        default:
          return true;
      }
    } catch (err) {
      return false;
    }
  }
}
