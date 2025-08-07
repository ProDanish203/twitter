import { User } from '@prisma/client';
import { PaginationInfo } from 'src/common/types/types';
import { UserSelect } from '../queries';

export interface GetAllUserResponse {
  users: UserSelect[];
  pagination: PaginationInfo;
}
