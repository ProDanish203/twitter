import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { ApiResponse, QueryParams } from 'src/common/types/types';
import { throwError } from 'src/common/utils/helpers';
import { NotificationsService } from 'src/notifications/notifications.service';
import { minimalUserSelect } from 'src/user/queries';
import { UserService } from 'src/user/user.service';
import {
  GetSinglePostResponse,
  GetUserLikedPostsResponse,
  GetUserPostsResponse,
  PopulatedMedia,
  PopulatedPost,
  PostWithIncludes,
} from './types';

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

  async getSinglePost(
    id: string,
    user: User,
  ): Promise<ApiResponse<GetSinglePostResponse>> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id, userId: user.id, deletedAt: null },
        include: {
          author: {
            select: minimalUserSelect,
          },
          media: true,
          postStats: true,
          comments: {
            where: { deletedAt: null },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: minimalUserSelect,
              },
              media: true,
              postStats: true,
            },
          },
        },
      });

      if (!post) throw throwError('Post not found', HttpStatus.NOT_FOUND);

      const [populatedPost, populatedComments] = await Promise.all([
        this._populatePost(post),
        Promise.all(post.comments.map((c) => this._populatePost(c))),
      ]);

      return {
        message: 'Post retrieved successfully',
        success: true,
        data: {
          post: populatedPost,
          comments: populatedComments,
        },
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve post',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async _populatePost(
    post: PostWithIncludes | PostWithIncludes['comments'][0],
  ): Promise<PopulatedPost> {
    try {
      const author = await this.userService.populateUser(post.author);

      const populatedMedia: PopulatedMedia[] = [];
      if (post.media && post.media.length > 0) {
        const mediaPromises = post.media.map(
          async (media): Promise<PopulatedMedia> => {
            const [signedUrl, signedThumbnailUrl] = await Promise.all([
              this.storageService.getImageUrl(media.url),
              media.thumbnailUrl
                ? this.storageService.getImageUrl(media.thumbnailUrl)
                : Promise.resolve(null),
            ]);

            return {
              ...media,
              url: signedUrl,
              thumbnailUrl: signedThumbnailUrl,
            };
          },
        );

        const resolvedMedia = await Promise.all(mediaPromises);
        populatedMedia.push(...resolvedMedia);
      }

      return {
        ...post,
        author,
        media: populatedMedia,
        stats: post.postStats,
      };
    } catch (err) {
      console.error(err.message);
      return { ...post, stats: post.postStats };
    }
  }

  async getUserPosts(
    userId: string,
    query: QueryParams,
  ): Promise<ApiResponse<GetUserPostsResponse>> {
    try {
      const { page = 1, limit = 20 } = query;

      const where: Prisma.PostWhereInput = {
        userId: userId,
        deletedAt: null,
      };

      const skip = (Number(page) - 1) * Number(limit);

      const [totalCount, posts] = await Promise.all([
        this.prisma.post.count({ where }),
        this.prisma.post.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            media: true,
            postStats: true,
            author: {
              select: minimalUserSelect,
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      const populatedPosts = await Promise.all(
        posts.map((post) => this._populatePost(post)),
      );

      return {
        message: 'User posts retrieved successfully',
        success: true,
        data: {
          posts: populatedPosts,
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

  async deletePost(user: User, id: string): Promise<ApiResponse> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id, userId: user.id, deletedAt: null },
        include: {
          media: true,
          likes: { select: { userId: true } },
          comments: {
            select: { id: true, userId: true },
          },
          reposts: {
            select: { id: true, userId: true },
          },
        },
      });

      if (!post) throw throwError('Post not found', HttpStatus.NOT_FOUND);

      const mediaUrlsToDelete: string[] = [];
      const likesCount = new Set<string>();

      if (post.media?.length > 0) {
        post.media.forEach((media) => {
          if (media.url) mediaUrlsToDelete.push(media.url);
          if (media.thumbnailUrl) mediaUrlsToDelete.push(media.thumbnailUrl);
        });
      }

      post.likes?.forEach((like) => {
        likesCount.add(like.userId);
      });

      // Make the comments as orphaned
      if (post.comments?.length > 0) {
        await this.prisma.post.updateMany({
          where: {
            parentId: post.id,
          },
          data: {
            parentId: null,
            wasCommentFor: post.id,
            updatedAt: new Date(),
          },
        });
      }

      // Make the reposts as orphaned
      if (post.reposts?.length > 0) {
        await this.prisma.post.updateMany({
          where: {
            repostId: post.id,
          },
          data: {
            repostId: null,
            wasRepostFor: post.id,
            updatedAt: new Date(),
          },
        });
      }

      // Delete all database records for this post
      await Promise.all([
        this.prisma.postStats.deleteMany({ where: { postId: post.id } }),
        this.prisma.like.deleteMany({ where: { postId: post.id } }),
        this.prisma.media.deleteMany({ where: { postId: post.id } }),
      ]);

      // Remove media files from storage
      if (mediaUrlsToDelete.length > 0) {
        await Promise.all(
          mediaUrlsToDelete.map((url) =>
            this.storageService
              .removeFile(url)
              .catch((err) =>
                console.error(`Failed to delete media file: ${url}`, err),
              ),
          ),
        );
      }

      // Update the user stats for users who liked this post
      if (likesCount.size > 0) {
        await this.userService.updateUserStats(
          Array.from(likesCount),
          'likesCount',
          'decrement',
          1,
        );
      }

      // Finally delete the post
      await Promise.all([
        this.prisma.post.delete({ where: { id: post.id } }),
        this.userService.updateUserStats(
          [user.id],
          'postsCount',
          'decrement',
          1,
        ),
      ]);

      return {
        message: 'Post deleted successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to delete post',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLikedPosts(
    user: User,
    query: QueryParams,
  ): Promise<ApiResponse<GetUserLikedPostsResponse>> {
    try {
      const { page = 1, limit = 20 } = query;
      const where: Prisma.PostWhereInput = {
        likes: {
          some: { userId: user.id },
        },
      };

      const skip = (Number(page) - 1) * Number(limit);

      const [totalCount, posts] = await Promise.all([
        this.prisma.post.count({ where }),
        this.prisma.post.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            media: true,
            postStats: true,
            author: {
              select: minimalUserSelect,
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      const populatedPosts = await Promise.all(
        posts.map((post) => this._populatePost(post)),
      );

      return {
        message: 'Liked posts retrieved successfully',
        success: true,
        data: {
          posts: populatedPosts,
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
        err.message || 'Failed to retrieve liked posts',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserReplies(user: User, query: QueryParams): Promise<ApiResponse> {
    try {
      // Get all the comments user has made,
      // Get all the retweets
      // Get all the quote tweets

      return {
        message: 'User replies retrieved successfully',
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to retrieve commented posts',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
