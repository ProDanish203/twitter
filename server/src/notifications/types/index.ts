import { Notification } from '@prisma/client';
import { PaginationInfo } from 'src/common/types/types';
import { MinimalUserSelect } from 'src/user/queries';

export interface GetAllNotificationsResponse {
  notifications: GetNotification[];
  pagination: PaginationInfo;
}

export interface GetNotification extends Notification {
  actor?: MinimalUserSelect;
}
