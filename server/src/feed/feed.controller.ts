import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FeedService } from './feed.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { QueryParams } from 'src/common/types/types';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(AuthGuard)
  @Roles(...Object.values(UserRole))
  @ApiProperty({ title: 'Get User Posts' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get()
  async getFeedForUser(@CurrentUser() user: User, @Query() query: QueryParams) {
    return await this.feedService.getFeedForUser(user, query);
  }
}
