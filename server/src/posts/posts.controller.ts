import { User, UserRole } from '@prisma/client';
import {
  Controller,
  UseGuards,
  Patch,
  Get,
  Delete,
  Param,
  Query,
  Body,
  Post,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { QueryParams } from 'src/common/types/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Create Post' })
  @Post()
  async createPost(@CurrentUser() user: User) {
    return await this.postsService.createPost(user);
  }

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get All Posts' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'filter', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @Get()
  async getAllPosts(@CurrentUser() user: User, @Query() query: QueryParams) {
    return await this.postsService.getAllPosts(user, query);
  }

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get User Feed' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('feed')
  async getUserFeed(@CurrentUser() user: User, @Query() query: QueryParams) {
    return await this.postsService.getUserFeed(user, query);
  }

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get User Posts' })
  @ApiParam({ name: 'userId', required: true })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('user/:userId')
  async getUserPosts(
    @Param('userId') userId: string,
    @Query() query: QueryParams,
  ) {
    return await this.postsService.getUserPosts(userId, query);
  }

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Edit Post' })
  @ApiParam({ name: 'id', required: true })
  @Patch(':id')
  async editPost(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.postsService.editPost(user, id);
  }

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Delete Post' })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  async deletePost(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.postsService.deletePost(user, id);
  }

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get Liked Posts' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('liked')
  async getLikedPosts(@CurrentUser() user: User, @Query() query: QueryParams) {
    return await this.postsService.getLikedPosts(user, query);
  }

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get Liked Posts' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('commented')
  async getCommentedPosts(
    @CurrentUser() user: User,
    @Query() query: QueryParams,
  ) {
    return await this.postsService.getCommentedPosts(user, query);
  }

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get Single Post' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async getSinglePost(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.postsService.getSinglePost(id, user);
  }
}
