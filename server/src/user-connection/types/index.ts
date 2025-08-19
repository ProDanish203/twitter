import { FollowRequest } from '@prisma/client';
import { PaginationInfo } from 'src/common/types/types';

export interface GetAllRequests {
  requests: FollowRequest[];
  pagination: PaginationInfo;
}
