import {
  Notification,
  NotificationSettings,
  NotificationType,
} from '@prisma/client';
import { PaginationInfo } from 'src/common/types/types';
import { MinimalUserSelect } from 'src/user/queries';

export interface GetAllNotificationsResponse {
  notifications: GetNotification[];
  pagination: PaginationInfo;
}

export interface GetNotification extends Notification {
  actor?: MinimalUserSelect;
}

export type NotificationSettingFields = Omit<
  NotificationSettings,
  'userId' | 'user' | 'createdAt' | 'updatedAt'
>;

export type EmailNotificationFields = keyof Pick<
  NotificationSettingFields,
  | 'emailEnabled'
  | 'emailInfo'
  | 'emailFollowRequests'
  | 'emailFollows'
  | 'emailLikes'
  | 'emailComments'
  | 'emailReposts'
  | 'emailPosts'
  | 'emailReplies'
  | 'emailMentions'
  | 'emailPostInteractions'
  | 'emailDirectMessages'
  | 'emailSystem'
>;

export type PushNotificationFields = keyof Pick<
  NotificationSettingFields,
  | 'pushEnabled'
  | 'pushInfo'
  | 'pushFollowRequests'
  | 'pushFollows'
  | 'pushLikes'
  | 'pushComments'
  | 'pushReposts'
  | 'pushPosts'
  | 'pushReplies'
  | 'pushMentions'
  | 'pushPostInteractions'
  | 'pushDirectMessages'
  | 'pushSystem'
>;

export type InAppNotificationFields = keyof Pick<
  NotificationSettingFields,
  | 'inAppEnabled'
  | 'inAppInfo'
  | 'inAppFollowRequests'
  | 'inAppFollows'
  | 'inAppLikes'
  | 'inAppComments'
  | 'inAppReposts'
  | 'inAppPosts'
  | 'inAppReplies'
  | 'inAppMentions'
  | 'inAppPostInteractions'
  | 'inAppDirectMessages'
  | 'inAppSystem'
>;

export enum NOTIFICATION_ENTITY_TYPE {
  POST = 'post',
  COMMENT = 'comment',
  LIKE = 'like',
  FOLLOW = 'follow',
  FOLLOW_REQUEST = 'follow_request',
}

export enum NOTIFICATION_MEDIUM {
  EMAIL = 'email',
  PUSH = 'push',
  IN_APP = 'inApp',
}

export type CreateNotificationPayload = {
  title: string;
  message: string;
  type: NotificationType;
  url?: string;
  priority?: number;
  actorId?: string;
  entityId?: string;
  entityType?: NOTIFICATION_ENTITY_TYPE;
};
