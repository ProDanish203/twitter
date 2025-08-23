import { StorageService } from './../common/services/storage.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { throwError } from 'src/common/utils/helpers';
import {
  User,
  FollowRequest,
  FollowRequestStatus,
  Prisma,
  NotificationType,
} from '@prisma/client';
import {
  RespondToFollowRequestDto,
  SendFollowRequestDto,
} from './dto/requests.dto';
import { ApiResponse, QueryParams } from 'src/common/types/types';
import { GetAllRequests, GetFollowees, GetFollowers } from './types';
import { UserService } from 'src/user/user.service';
import { MinimalUserSelect, minimalUserSelect } from 'src/user/queries';
import { NotificationsService } from 'src/notifications/notifications.service';
import {
  NOTIFICATION_ENTITY_TYPE,
  NOTIFICATION_MEDIUM,
} from 'src/notifications/types';

@Injectable()
export class UserConnectionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationsService,
  ) {}

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
        select: { id: true },
      });

      if (!toUser) throw throwError('User not found', HttpStatus.NOT_FOUND);

      // Create the request
      const followRequest = await this.prismaService.followRequest.create({
        data: {
          fromUserId: user.id,
          toUserId: toUserId,
        },
      });

      await this.notificationService.createNotification(
        toUser.id,
        {
          title: `${user.username} wants to follow you`,
          message: `${user.name} has sent you a follow request.`,
          type: NotificationType.FOLLOW_REQUEST,
          actorId: user.id,
          entityType: NOTIFICATION_ENTITY_TYPE.FOLLOW_REQUEST,
          entityId: user.id,
          url: `users/${user.id}`,
        },
        NOTIFICATION_MEDIUM.IN_APP,
      );

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
          this.userService.updateUserStats(
            user.id,
            'followersCount',
            'increment',
          ),
          this.userService.updateUserStats(
            fromUserId,
            'followingCount',
            'increment',
          ),
        ]);

        // TODO: Send notification to follower
        await this.notificationService.createNotification(
          fromUserId,
          {
            title: `${user.username} has accepted your follow request`,
            message: `${user.name} has accepted your follow request.`,
            type: NotificationType.FOLLOW_REQUEST,
            actorId: user.id,
            entityType: NOTIFICATION_ENTITY_TYPE.FOLLOW_REQUEST,
            entityId: user.id,
            url: `users/${user.id}`,
          },
          NOTIFICATION_MEDIUM.IN_APP,
        );
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
        status: FollowRequestStatus.PENDING,
      };

      const orderBy: Prisma.FollowRequestOrderByWithRelationInput = {};
      // sort will be the field to be sorted, e.g: createdAt
      if (sort) orderBy[sort] = 'asc';

      const [sentRequestIds, totalCount] = await Promise.all([
        this.prismaService.followRequest.findMany({
          where,
          orderBy,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          select: { toUserId: true, createdAt: true },
        }),
        this.prismaService.followRequest.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      if (sentRequestIds.length === 0) {
        return {
          message: 'No sent follow requests found',
          success: true,
          data: {
            requests: [],
            pagination: {
              totalCount: 0,
              totalPages: 0,
              page: Number(page),
              limit: Number(limit),
              hasNextPage: false,
              hasPrevPage: false,
            },
          },
        };
      }

      const sentRequests = await this.userService.getUsersByQuery(
        {
          id: { in: sentRequestIds.map((r) => r.toUserId) },
          deletedAt: null,
        },
        minimalUserSelect,
      );

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
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
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

  async getReceivedFollowRequests(
    user: User,
    query?: QueryParams,
  ): Promise<ApiResponse<GetAllRequests>> {
    try {
      const { page = 1, limit = 20, sort = '' } = query;

      const where: Prisma.FollowRequestWhereInput = {
        toUserId: user.id,
        status: FollowRequestStatus.PENDING,
      };

      const orderBy: Prisma.FollowRequestOrderByWithRelationInput = {};
      // sort will be the field to be sorted, e.g: createdAt
      if (sort) orderBy[sort] = 'asc';

      const [followRequestUserIds, totalCount] = await Promise.all([
        this.prismaService.followRequest.findMany({
          where,
          orderBy,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          select: {
            fromUserId: true,
            createdAt: true,
          },
        }),
        this.prismaService.followRequest.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      if (followRequestUserIds.length === 0) {
        return {
          message: 'No received follow requests found',
          success: true,
          data: {
            requests: [],
            pagination: {
              totalCount: 0,
              totalPages: 0,
              page: Number(page),
              limit: Number(limit),
              hasNextPage: false,
              hasPrevPage: false,
            },
          },
        };
      }

      const followRequests = await this.userService.getUsersByQuery(
        {
          id: { in: followRequestUserIds.map((r) => r.fromUserId) },
          deletedAt: null,
        },
        minimalUserSelect,
      );

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
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
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
      void this.prismaService.notification.deleteMany({
        where: {
          userId: toUserId,
          actorId: user.id,
          type: NotificationType.FOLLOW_REQUEST,
        },
      });

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

      // if (search) {
      //   where.follower = {
      //     username: { contains: search, mode: 'insensitive' },
      //   };
      // }

      const [followerIds, totalCount] = await Promise.all([
        this.prismaService.follow.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          select: { followerId: true },
        }),
        this.prismaService.follow.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      const followers = await this.userService.getUsersByQuery(
        {
          id: { in: followerIds.map((f) => f.followerId) },
          deletedAt: null,
        },
        minimalUserSelect,
      );

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
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
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

      // if (search) {
      //   where.followee = {
      //     username: { contains: search, mode: 'insensitive' },
      //   };
      // }

      const [followeeIds, totalCount] = await Promise.all([
        this.prismaService.follow.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          select: { followeeId: true },
        }),
        this.prismaService.follow.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      const followees = await this.userService.getUsersByQuery(
        {
          id: { in: followeeIds.map((f) => f.followeeId) },
          deletedAt: null,
        },
        minimalUserSelect,
      );

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
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
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

  async unfollowUser(user: User, followeeId: string): Promise<ApiResponse> {
    try {
      const followee = await this.prismaService.follow.findUnique({
        where: {
          followerId_followeeId: {
            followerId: user.id,
            followeeId: followeeId,
          },
        },
      });

      if (!followee)
        throw throwError(
          'You are not following this user',
          HttpStatus.BAD_REQUEST,
        );

      // Unfollow the user
      await this.prismaService.follow.delete({
        where: {
          followerId_followeeId: {
            followerId: user.id,
            followeeId: followeeId,
          },
        },
      });

      // Update user stats for both followee and follower
      await Promise.all([
        this.userService.updateUserStats(
          user.id,
          'followingCount',
          'decrement',
        ),
        this.userService.updateUserStats(
          followeeId,
          'followersCount',
          'decrement',
        ),
      ]);

      return {
        message: 'Unfollowed user successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to unfollow user',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFollower(user: User, followerId: string): Promise<ApiResponse> {
    try {
      const follower = await this.prismaService.follow.findUnique({
        where: {
          followerId_followeeId: {
            followerId: followerId,
            followeeId: user.id,
          },
        },
      });

      if (!follower)
        throw throwError(
          'This user is not your follower',
          HttpStatus.BAD_REQUEST,
        );

      // Remove the follower
      await this.prismaService.follow.delete({
        where: {
          followerId_followeeId: {
            followerId: followerId,
            followeeId: user.id,
          },
        },
      });

      // Update user stats for both follower and followee
      await Promise.all([
        this.userService.updateUserStats(
          user.id,
          'followersCount',
          'decrement',
        ),
        this.userService.updateUserStats(
          followerId,
          'followingCount',
          'decrement',
        ),
      ]);

      return {
        message: 'Follower removed successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to remove follower',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRecommendedUsers(user: User): Promise<ApiResponse> {
    try {
      return {
        message: 'Recommended users retrieved successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get recommended users',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMutualFollowers(
    user: User,
    profileUserId: string,
  ): Promise<ApiResponse<MinimalUserSelect[]>> {
    try {
      // Get my following user IDs
      const myFollowingIds = await this.prismaService.follow.findMany({
        where: { followerId: user.id },
        select: { followeeId: true },
      });

      const myFollowingUserIds = myFollowingIds.map((f) => f.followeeId);

      if (myFollowingUserIds.length === 0) {
        return {
          message: 'No mutual users found',
          success: true,
          data: [],
        };
      }

      // Check which of my following users are also following the profile user
      const mutualIds = await this.prismaService.follow.findMany({
        where: {
          followerId: profileUserId,
          followeeId: { in: myFollowingUserIds },
        },
        select: { followeeId: true },
      });

      const mutualUserIds = mutualIds.map((f) => f.followeeId);

      const users = await this.userService.getUsersByQuery(
        {
          id: { in: mutualUserIds },
          deletedAt: null,
        },
        minimalUserSelect,
      );

      return {
        message: 'Mutual users retrieved successfully',
        success: true,
        data: users,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get mutual users',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
