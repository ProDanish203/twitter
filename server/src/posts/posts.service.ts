import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Media,
  MediaType,
  NotificationStatus,
  NotificationType,
  PostType,
  PostVisibility,
  Prisma,
  User,
} from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { ApiResponse, QueryParams } from 'src/common/types/types';
import { throwError } from 'src/common/utils/helpers';
import { NotificationsService } from 'src/notifications/notifications.service';
import { minimalUserSelect } from 'src/user/queries';
import { UserService } from 'src/user/user.service';
import {
  GetSinglePostResponse,
  GetUserLikedPostsResponse,
  GetUserPostsResponse,
  GetUserRepliesResponse,
  PopulatedMedia,
  PopulatedPost,
  PostWithIncludes,
} from './types';
import {
  NOTIFICATION_ENTITY_TYPE,
  NOTIFICATION_MEDIUM,
} from 'src/notifications/types';
import { StorageService } from 'src/storage/storage.service';
import { AddPostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly noitificationService: NotificationsService,
    private readonly storageService: StorageService,
  ) {}

  async createPost(user: User, dto: AddPostDto): Promise<ApiResponse<string>> {
    try {
      const { content, media, parentId, repostId, visibility, mentions, tags } =
        dto;

      const postType = this._determinePostType(dto);

      // Check when its a repost of some post
      if (postType === PostType.REPOST || postType === PostType.QUOTE) {
        const repost = await this.prisma.post.findUnique({
          where: { id: repostId, deletedAt: null },
          select: { id: true },
        });

        if (!repost)
          throw throwError(
            'Original post not found or is deleted',
            HttpStatus.NOT_FOUND,
          );
      }

      // Check when its a comment for a post
      if (postType === PostType.COMMENT) {
        const parent = await this.prisma.post.findUnique({
          where: { id: parentId, deletedAt: null },
          select: { id: true },
        });

        if (!parent)
          throw throwError(
            'Parent post not found or is deleted',
            HttpStatus.NOT_FOUND,
          );
      }

      if (
        postType !== PostType.REPOST &&
        !content &&
        (!media || !media.length)
      ) {
        throw throwError(
          'Post content or media is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Create the post
      const newPost = await this.prisma.post.create({
        data: {
          userId: user.id,
          content,
          parentId,
          repostId,
          visibility: visibility || PostVisibility.PUBLIC,
          mentions,
          tags,
          postType: postType || PostType.ORIGINAL,
        },
      });

      // Create media for this post
      if (media && media.length) {
        await Promise.all(
          media.map((item) =>
            this.prisma.media.create({
              data: {
                postId: newPost.id,
                userId: user.id,
                type: MediaType.IMAGE,
                url: item,
              },
            }),
          ),
        );
      }

      // Handle post mentions
      if (mentions && mentions.length > 0) {
        const mentionedUsers = await this.prisma.user.findMany({
          where: {
            id: { in: mentions },
            deletedAt: null,
          },
          select: { id: true },
        });

        // send notification to the mentioned users
        Promise.all(
          mentionedUsers.map(({ id }) =>
            this.noitificationService.createNotification(
              id,
              {
                title: `${user.username} mentioned you in a post`,
                url: `/posts/${newPost.id}`,
                actorId: user.id,
                type: NotificationType.MENTION,
                entityId: newPost.id,
                entityType: NOTIFICATION_ENTITY_TYPE.POST,
              },
              NOTIFICATION_MEDIUM.IN_APP,
            ),
          ),
        );
      }

      // Update user stats
      this.userService.updateUserStats([user.id], 'postsCount', 'increment', 1);

      return {
        message: 'Post created successfully',
        success: true,
        data: newPost.id,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to create post',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private _determinePostType(dto: AddPostDto): PostType {
    const { repostId, parentId, content, media } = dto;

    if (parentId) return PostType.COMMENT;
    else if (repostId && (content || (media && media.length)))
      return PostType.QUOTE;
    else if (repostId) return PostType.REPOST;
    return PostType.ORIGINAL;
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
    userId: string,
    query: QueryParams,
  ): Promise<ApiResponse<GetUserLikedPostsResponse>> {
    try {
      const { page = 1, limit = 20 } = query;
      const where: Prisma.PostWhereInput = {
        likes: {
          some: { userId },
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

  async getUserReplies(
    userId: string,
    query: QueryParams,
  ): Promise<ApiResponse<GetUserRepliesResponse>> {
    try {
      const { page = 1, limit = 20 } = query;
      // Get all the comments, retweets, and quote tweets user has made,
      const where: Prisma.PostWhereInput = {
        userId,
        OR: [
          {
            parentId: {
              not: null,
            },
          },
          {
            repostId: {
              not: null,
            },
          },
        ],
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
        message: 'User replies retrieved successfully',
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
        err.message || 'Failed to retrieve commented posts',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserMedia(userId: string, query: QueryParams): Promise<ApiResponse> {
    try {
      const { page = 1, limit = 20 } = query;

      const where: Prisma.MediaWhereInput = {
        userId,
      };

      const skip = (Number(page) - 1) * Number(limit);

      // Get all the media that user has ever posted
      const [totalCount, media] = await Promise.all([
        this.prisma.media.count({ where }),
        this.prisma.media.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      const populatedMedia = await this._populateMedias(media);

      return {
        message: 'User media retrieved successfully',
        success: true,
        data: {
          media: populatedMedia,
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
        err.message || 'Failed to retrieve user media',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async _populateMedias(medias: Media[]): Promise<PopulatedMedia[]> {
    try {
      const populatedMedia: PopulatedMedia[] = [];

      const mediaPromises = medias.map(
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

      return populatedMedia;
    } catch (err) {
      return [];
    }
  }

  async likePost(user: User, postId: string): Promise<ApiResponse> {
    try {
      const [likeExists, post] = await Promise.all([
        this.prisma.like.findUnique({
          where: {
            userId_postId: {
              userId: user.id,
              postId,
            },
          },
        }),
        this.prisma.post.findUnique({
          where: { id: postId },
          select: { id: true, userId: true },
        }),
      ]);

      if (likeExists) {
        await this.prisma.like.delete({
          where: { userId_postId: { userId: user.id, postId: post.id } },
        });

        Promise.all([
          this.userService.updateUserStats(
            [user.id],
            'likesCount',
            'decrement',
            1,
          ),
          // Remove the notification if it was unread
          this.prisma.notification.deleteMany({
            where: {
              status: NotificationStatus.UNREAD,
              readAt: null,
              actorId: user.id,
              entityId: post.id,
              entityType: NOTIFICATION_ENTITY_TYPE.LIKE,
            },
          }),
          this.noitificationService.handleUserHasNotifications(post.userId),
        ]);
      } else {
        await this.prisma.like.create({
          data: { postId: post.id, userId: user.id },
        });

        // Dont await
        Promise.all([
          this.userService.updateUserStats(
            [user.id],
            'likesCount',
            'increment',
            1,
          ),
          this.noitificationService.createNotification(
            post.userId,
            {
              actorId: user.id,
              title: `${user.username} liked your post`,
              url: `/posts/${post.id}`,
              type: 'LIKE',
              entityId: post.id,
              entityType: NOTIFICATION_ENTITY_TYPE.LIKE,
            },
            NOTIFICATION_MEDIUM.IN_APP,
          ),
        ]);
      }

      return {
        message: `Post ${likeExists ? 'unliked' : 'liked'} successfully`,
        success: true,
      };
    } catch (err) {
      throw throwError(
        err.message || 'Failed to like post',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
