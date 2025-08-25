import { Media, Post, PostStats, Prisma } from '@prisma/client';
import { PaginationInfo } from 'src/common/types/types';
import { minimalUserSelect, MinimalUserSelect } from 'src/user/queries';

export interface PopulatedMedia extends Omit<Media, 'url' | 'thumbnailUrl'> {
  url: string;
  thumbnailUrl: string | null;
}

export interface PopulatedPost extends Post {
  author: MinimalUserSelect;
  media: PopulatedMedia[];
  stats: PostStats;
}

export interface GetSinglePostResponse {
  post: PopulatedPost;
  comments: PopulatedPost[];
}

export type PostWithIncludes = Prisma.PostGetPayload<{
  include: {
    author: {
      select: typeof minimalUserSelect;
    };
    media: true;
    postStats: true;
    comments: {
      include: {
        author: {
          select: typeof minimalUserSelect;
        };
        media: true;
        postStats: true;
      };
    };
  };
}>;

export interface GetUserPostsResponse {
  posts: PopulatedPost[];
  pagination: PaginationInfo;
}

export interface GetUserLikedPostsResponse {
  posts: PopulatedPost[];
  pagination: PaginationInfo;
}
