import { PrismaService } from 'src/common/services/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { throwError } from 'src/common/utils/helpers';
import { UserRole, User, FollowRequest } from '@prisma/client';
import { SendFollowRequestDto } from './dto/requests.dto';
import { ApiResponse } from 'src/common/types/types';

@Injectable()
export class UserConnectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async sendFollowRequest(
    user: User,
    { toUserId }: SendFollowRequestDto,
  ): Promise<ApiResponse<FollowRequest>> {
    try {
      const existingRequest = await this.prismaService.followRequest.findFirst({
        where: {
          fromUserId: user.id,
          toUserId: toUserId,
        },
      });

      if (existingRequest)
        throw throwError('Follow request already sent', HttpStatus.BAD_REQUEST);

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

  async respondToFollowRequest() {
    try {
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
