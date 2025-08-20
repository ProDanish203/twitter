import {
  Controller,
  UseGuards,
  Patch,
  Get,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { UserRole, User } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { QueryParams } from 'src/common/types/types';

@UseGuards(AuthGuard)
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get All Notifications' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get()
  async getAllNotifications(
    @CurrentUser() user: User,
    @Query() query: QueryParams,
  ) {
    // return this.notificationsService.getAllNotifications(user, query);
  }

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get Notification Settings' })
  @Get('settings')
  async getNotificationSettings(@CurrentUser() user: User) {
    // return this.notificationsService.getNotificationSettings(user);
  }

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get Unread Notifications Count' })
  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: User) {
    // return this.notificationsService.getUnreadCount(user);
  }

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Update Notification Settings' })
  @Patch('settings')
  async updateNotificationSettings(@CurrentUser() user: User) {
    // return this.notificationsService.updateNotificationSettings(user);
  }

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Mark All Notifications as Read' })
  @Patch('mark-all-as-read')
  async markAllAsRead(@CurrentUser() user: User) {
    // return this.notificationsService.markAllAsRead(user);
  }

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Mark Notification as Read' })
  @ApiParam({ name: 'notificationId', required: true })
  @Patch('read/:notificationId')
  async markAsRead(
    @CurrentUser() user: User,
    @Param('notificationId') notificationId: string,
  ) {
    // return this.notificationsService.markAsRead(user, notificationId);
  }

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Clear All Notifications' })
  @Delete('clear-all')
  async clearAllNotifications(@CurrentUser() user: User) {
    // return this.notificationsService.clearAllNotifications(user);
  }

  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Delete Notification' })
  @ApiParam({ name: 'notificationId', required: true })
  @Delete('/:notificationId')
  async deleteNotification(
    @CurrentUser() user: User,
    @Param('notificationId') notificationId: string,
  ) {
    // return this.notificationsService.deleteNotification(user, notificationId);
  }
}
