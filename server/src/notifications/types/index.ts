import { Notification, NotificationSettings } from '@prisma/client';
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
