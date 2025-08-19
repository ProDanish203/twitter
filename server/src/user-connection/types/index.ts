import { Follow, FollowRequest } from '@prisma/client';
import { PaginationInfo } from 'src/common/types/types';
import { MinimalUserSelect } from 'src/user/queries';

export interface GetAllRequests {
  requests: MinimalUserSelect[];
  pagination: PaginationInfo;
}

export interface GetFollowers {
  followers: MinimalUserSelect[];
  pagination: PaginationInfo;
}

export interface GetFollowees {
  followees: MinimalUserSelect[];
  pagination: PaginationInfo;
}
