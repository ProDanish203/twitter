import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from 'src/user/user.service';
import { throwError } from 'src/common/utils/helpers';
import { User } from '@prisma/client';
import { QueryParams } from 'src/common/types/types';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getAllNotifications(user: User, query?: QueryParams) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get notifications',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNotificationSettings(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get notification settings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUnreadCount(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get unread notifications count',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateNotificationSettings(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update notification settings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async markAllAsRead(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to mark all notifications as read',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async markAsRead(user: User, notificationId: string) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to mark notification as read',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async clearAllNotifications(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to clear all notifications',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteNotification(user: User, notificationId: string) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to delete notification',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Internal Services
}
