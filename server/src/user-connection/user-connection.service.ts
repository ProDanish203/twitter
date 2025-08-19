import { PrismaService } from 'src/common/services/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { throwError } from 'src/common/utils/helpers';
import {
  User,
  FollowRequest,
  FollowRequestStatus,
  Prisma,
} from '@prisma/client';
import {
  RespondToFollowRequestDto,
  SendFollowRequestDto,
} from './dto/requests.dto';
import { ApiResponse, QueryParams } from 'src/common/types/types';
import { GetAllRequests, GetFollowees, GetFollowers } from './types';

@Injectable()
export class UserConnectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async sendFollowRequest(
    user: User,
    { toUserId }: SendFollowRequestDto,
  ): Promise<ApiResponse<FollowRequest>> {
    try {
      const existingRequest = await this.prismaService.followRequest.findUnique(
        {
          where: {
            fromUserId_toUserId: {
              fromUserId: user.id,
              toUserId: toUserId,
            },
          },
        },
      );

      if (existingRequest)
        throw throwError('Follow request already sent', HttpStatus.BAD_REQUEST);

      // Check if user exists
      const toUser = await this.prismaService.user.findUnique({
        where: {
          id: toUserId,
        },
      });

      if (!toUser) throw throwError('User not found', HttpStatus.NOT_FOUND);

      // Create the request
      const followRequest = await this.prismaService.followRequest.create({
        data: {
          fromUserId: user.id,
          toUserId: toUserId,
        },
      });

      return {
        success: true,
        message: 'Follow request sent successfully',
        data: followRequest,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to send follow request',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async respondToFollowRequest(
    user: User,
    { status }: RespondToFollowRequestDto,
    fromUserId: string,
  ): Promise<ApiResponse> {
    try {
      const followRequest = await this.prismaService.followRequest.findUnique({
        where: {
          fromUserId_toUserId: {
            fromUserId: fromUserId,
            toUserId: user.id,
          },
        },
      });

      if (!followRequest)
        throw throwError('Follow request not found', HttpStatus.NOT_FOUND);

      if (status === FollowRequestStatus.ACCEPTED) {
        // Add as follower
        const follower = await this.prismaService.follow.create({
          data: {
            followerId: fromUserId,
            followeeId: user.id,
          },
        });

        if (!follower)
          throw throwError(
            'Failed to respond to follow request',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );

        // Update user stats
        await Promise.all([
          this.prismaService.userStats.update({
            where: {
              userId: user.id,
            },
            data: {
              followersCount: {
                increment: 1,
              },
              lastStatsUpdate: new Date(),
            },
          }),
          this.prismaService.userStats.update({
            where: {
              userId: fromUserId,
            },
            data: {
              followingCount: {
                increment: 1,
              },
              lastStatsUpdate: new Date(),
            },
          }),
        ]);

        // TODO: Send notification to follower
      } else if (status === FollowRequestStatus.REJECTED) {
      }

      // Delete the request record after successfull response
      await this.prismaService.followRequest.delete({
        where: {
          fromUserId_toUserId: {
            fromUserId: fromUserId,
            toUserId: user.id,
          },
        },
      });

      // Send no data
      return {
        message: 'Follow request responded successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to respond to follow request',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSentFollowRequests(
    user: User,
    query?: QueryParams,
  ): Promise<ApiResponse<GetAllRequests>> {
    try {
      const { page = 1, limit = 20, sort = '' } = query;

      const where: Prisma.FollowRequestWhereInput = {
        fromUserId: user.id,
      };

      const orderBy: Prisma.FollowRequestOrderByWithRelationInput = {};
      // sort will be the field to be sorted, e.g: createdAt
      if (sort) orderBy[sort] = 'asc';

      const [sentRequests, totalCount] = await Promise.all([
        this.prismaService.followRequest.findMany({
          where,
          orderBy,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        this.prismaService.followRequest.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      return {
        message: 'Sent follow requests retrieved successfully',
        success: true,
        data: {
          requests: sentRequests,
          pagination: {
            totalCount,
            totalPages,
            page: Number(page),
            limit: Number(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get sent follow requests',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getReceivedFollowRequests(user: User, query?: QueryParams) {
    try {
      const { page = 1, limit = 20, sort = '' } = query;

      const where: Prisma.FollowRequestWhereInput = {
        toUserId: user.id,
      };

      const orderBy: Prisma.FollowRequestOrderByWithRelationInput = {};
      // sort will be the field to be sorted, e.g: createdAt
      if (sort) orderBy[sort] = 'asc';

      const [followRequests, totalCount] = await Promise.all([
        this.prismaService.followRequest.findMany({
          where,
          orderBy,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        this.prismaService.followRequest.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      return {
        message: 'Received follow requests retrieved successfully',
        success: true,
        data: {
          requests: followRequests,
          pagination: {
            totalCount,
            totalPages,
            page: Number(page),
            limit: Number(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get received follow requests',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async revokeFollowRequest(
    user: User,
    toUserId: string,
  ): Promise<ApiResponse<FollowRequest>> {
    try {
      const deletedRequest = await this.prismaService.followRequest.delete({
        where: {
          fromUserId_toUserId: {
            fromUserId: user.id,
            toUserId: toUserId,
          },
        },
      });

      // Delete the notification of the toUser

      return {
        success: true,
        message: 'Follow request revoked successfully',
        data: deletedRequest,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to revoke follow request',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllFollowers(
    user: User,
    query?: QueryParams,
  ): Promise<ApiResponse<GetFollowers>> {
    try {
      const { page = 1, limit = 20, search = '' } = query;

      const where: Prisma.FollowWhereInput = {
        followeeId: user.id,
      };

      if (search) {
        where.follower = {
          username: { contains: search, mode: 'insensitive' },
        };
      }

      const [followers, totalCount] = await Promise.all([
        this.prismaService.follow.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        this.prismaService.follow.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      return {
        message: 'Followers retrieved successfully',
        success: true,
        data: {
          followers,
          pagination: {
            totalCount,
            totalPages,
            page: Number(page),
            limit: Number(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get all followers',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllFollowings(
    user: User,
    query?: QueryParams,
  ): Promise<ApiResponse<GetFollowees>> {
    try {
      const { page = 1, limit = 20, search = '' } = query;

      const where: Prisma.FollowWhereInput = {
        followerId: user.id,
      };

      if (search) {
        where.followee = {
          username: { contains: search, mode: 'insensitive' },
        };
      }

      const [followees, totalCount] = await Promise.all([
        this.prismaService.follow.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        this.prismaService.follow.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      return {
        message: 'Followers retrieved successfully',
        success: true,
        data: {
          followees,
          pagination: {
            totalCount,
            totalPages,
            page: Number(page),
            limit: Number(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get all followings',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async unfollowUser() {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to unfollow user',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFollower() {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to remove follower',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
