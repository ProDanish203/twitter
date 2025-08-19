import { PaginationInfo } from 'src/common/types/types';
import { UserSelect } from '../queries';
import { Prisma } from '@prisma/client';

export interface GetAllUserResponse {
  users: UserSelect[];
  pagination: PaginationInfo;
}

export type UserStatsNumericFields = {
  [K in keyof Prisma.UserStatsUpdateInput]: Prisma.UserStatsUpdateInput[K] extends
    | { increment?: number }
    | { decrement?: number }
    | { multiply?: number }
    | { divide?: number }
    | { set?: number }
    | number
    | null
    | undefined
    ? K
    : never;
}[keyof Prisma.UserStatsUpdateInput];

export type StatsAction =
  | 'increment'
  | 'decrement'
  | 'set'
  | 'multiply'
  | 'divide';
