import { PrismaService } from 'src/common/services/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { throwError } from 'src/common/utils/helpers';
import {
  UserRole,
  User,
  FollowRequest,
  FollowRequestStatus,
} from '@prisma/client';
import {
  RespondToFollowRequestDto,
  SendFollowRequestDto,
} from './dto/requests.dto';
import { ApiResponse } from 'src/common/types/types';

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

  async getSentFollowRequests() {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get sent follow requests',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getReceivedFollowRequests() {
    try {
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

  async getAllFollowers() {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to get all followers',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllFollowings() {
    try {
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
