import { ApiProperty } from '@nestjs/swagger';
import { PostType, PostVisibility } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddPostDto {
  @IsString({ message: 'Content must be a string' })
  @IsOptional({ message: 'Content is optional' })
  @ApiProperty({ type: String, required: false, example: 'This is a new post' })
  content?: string;

  @IsString({ each: true, message: 'Each media URL must be a string' })
  @IsArray({ message: 'Media must be an array' })
  @ArrayMaxSize(10, { message: 'Media array must contain at most 10 items' })
  @IsOptional({ message: 'Media is optional' })
  @ApiProperty({
    type: [String],
    required: false,
    example: ['73485748-image.jpeg', '873748474-video1.mp4'],
  })
  media?: string[];

  @IsOptional({ message: 'Post type is optional' })
  @IsString({ message: 'Post type must be a string' })
  @IsEnum(PostType, { message: 'Post type must be a valid enum value' })
  @ApiProperty({
    type: String,
    enum: PostType,
    required: false,
    example: PostType.ORIGINAL,
    default: PostType.ORIGINAL,
  })
  postType: PostType = PostType.ORIGINAL;

  @IsOptional({ message: 'Mentions are optional' })
  @IsArray({ message: 'Mentions must be an array' })
  @IsString({ each: true, message: 'Each mention must be a string' })
  @ApiProperty({
    type: [String],
    required: false,
    example: ['user1', 'user2'],
  })
  mentions?: string[];

  @IsOptional({ message: 'Post visibility is optional' })
  @IsString({ message: 'Post visibility must be a string' })
  @IsEnum(PostVisibility, {
    message: 'Post visibility must be a valid enum value',
  })
  @ApiProperty({
    type: String,
    enum: PostVisibility,
    required: false,
    example: PostVisibility.PUBLIC,
    default: PostVisibility.PUBLIC,
  })
  visibility: PostVisibility = PostVisibility.PUBLIC;

  // For comment
  @IsOptional({ message: 'Parent ID is optional' })
  @IsString({ message: 'Parent ID must be a string' })
  @ApiProperty({
    type: String,
    required: false,
    description: 'Parent post ID for adding a comment',
    example: 'postId123',
  })
  parentId?: string;

  // For repost
  @IsOptional({ message: 'Repost ID is optional' })
  @IsString({ message: 'Repost ID must be a string' })
  @ApiProperty({
    type: String,
    required: false,
    description: 'Repost ID for adding a repost',
    example: 'postId123',
  })
  repostId?: string;

  @IsOptional({ message: 'Tags are optional' })
  @IsArray({ message: 'Tags must be an array' })
  @ArrayMaxSize(30, { message: 'Tags array must contain at most 30 items' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @ApiProperty({ type: [String], required: false, example: ['tag1', 'tag2'] })
  tags?: string[];
}
