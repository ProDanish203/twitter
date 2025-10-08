import { Media } from "./media";
import { MinimalUser } from "./user";

export const PostVisibility = {
  PUBLIC: "PUBLIC",
  FOLLOWERS: "FOLLOWERS",
  PRIVATE: "PRIVATE",
} as const;

export const PostType = {
  ORIGINAL: "ORIGINAL",
  REPOST: "REPOST",
  QUOTE: "QUOTE",
  COMMENT: "COMMENT",
} as const;

export interface PostStats {
  postId: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  viewsCount: number;
  lastStatsUpdate: string;
}

export interface Post {
  id: string;
  content?: string;

  mentions: string[];
  tags: string[];
  visibility: keyof typeof PostVisibility;
  postType: keyof typeof PostType;

  parentId?: string | null;
  repostId?: string | null;

  wasCommentFor?: string | null;
  wasRepostFor?: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // Relations
  author: MinimalUser;
  stats: PostStats;
  media: Media[];
}

export interface DetailedPost extends Post {
  comments: Post[];
}
