import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { ApiResponse, QueryParams } from 'src/common/types/types';
import { throwError } from 'src/common/utils/helpers';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getFeedForUser(user: User, query: QueryParams): Promise<ApiResponse> {
    try {
      const { page = 1, limit = 20 } = query;
      const skip = (Number(page) - 1) * Number(limit);

      return {
        message: 'User feed retrieved successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get user feed',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
