import { Follow, FollowRequest } from '@prisma/client';
import { PaginationInfo } from 'src/common/types/types';

export interface GetAllRequests {
  requests: FollowRequest[];
  pagination: PaginationInfo;
}

export interface GetFollowers {
  followers: Follow[];
  pagination: PaginationInfo;
}

export interface GetFollowees {
  followees: Follow[];
  pagination: PaginationInfo;
}
