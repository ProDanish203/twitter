import { PrismaService } from 'src/common/services/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { throwError } from 'src/common/utils/helpers';
import { UserRole, User } from '@prisma/client';

@Injectable()
export class UserConnectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async sendFollowRequest() {
    try {
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

  async revokeFollowRequest() {
    try {
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
