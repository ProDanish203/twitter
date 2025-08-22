import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { QueryParams } from 'src/common/types/types';
import { throwError } from 'src/common/utils/helpers';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly noitificationService: NotificationsService,
    private readonly storageService: StorageService,
  ) {}

  async createPost(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to create post',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSinglePost(id: string, user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve post',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPosts(user: User, query: QueryParams) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve posts',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserFeed(user: User, query: QueryParams) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve user feed',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserPosts(user: User, userId: string, query: QueryParams) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve user posts',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editPost(user: User, id: string) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to edit post',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePost(user: User, id: string) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to delete post',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLikedPosts(user: User, query: QueryParams) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve liked posts',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCommentedPosts(user: User, query: QueryParams) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve commented posts',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
