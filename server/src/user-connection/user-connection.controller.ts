import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { UserConnectionService } from './user-connection.service';
import { ApiTags, ApiProperty, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User, UserRole } from '@prisma/client';
import {
  RespondToFollowRequestDto,
  SendFollowRequestDto,
} from './dto/requests.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@ApiTags('User Connection')
@Controller('user-connection')
export class UserConnectionController {
  constructor(private readonly userConnectionService: UserConnectionService) {}

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Send Follow Request', type: SendFollowRequestDto })
  @Post('send-request')
  async sendFollowRequest(
    @CurrentUser() user: User,
    @Body() dto: SendFollowRequestDto,
  ) {
    return this.userConnectionService.sendFollowRequest(user, dto);
  }

  @Roles(UserRole.USER)
  @ApiProperty({
    title: 'Respond to Follow Request',
    type: RespondToFollowRequestDto,
  })
  @ApiParam({ name: 'fromUserId', type: String, required: true })
  @Patch('respond-request/:fromUserId')
  async respondToFollowRequest(
    @CurrentUser() user: User,
    @Body() dto: RespondToFollowRequestDto,
    @Param('fromUserId') fromUserId: string,
  ) {
    // return this.userConnectionService.sendFollowRequest(dto);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Get Sent Follow Requests' })
  @Get('requests/sent')
  async getSentFollowRequests(@CurrentUser() user: User) {
    // return this.userConnectionService.getSentFollowRequests(user.id);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Get Received Follow Requests' })
  @Get('requests/received')
  async getReceivedFollowRequests(@CurrentUser() user: User) {
    // return this.userConnectionService.getReceivedFollowRequests(user.id);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Revoke Follow Request' })
  @ApiParam({ name: 'toUserId', type: String, required: true })
  @Delete('revoke-request/:toUserId')
  async revokeFollowRequest(
    @CurrentUser() user: User,
    @Param('toUserId') toUserId: string,
  ) {
    // return this.userConnectionService.revokeFollowRequest(user.id, toUserId);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Get all followers' })
  @Get('followers/all')
  async getAllFollowers(@CurrentUser() user: User) {
    // return this.userConnectionService.getAllFollowers(user.id);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Get all followings' })
  @Get('following/all')
  async getAllFollowings(@CurrentUser() user: User) {
    // return this.userConnectionService.getAllFollowings(user.id);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Unfollow User' })
  @ApiParam({ name: 'followeeId', type: String, required: true })
  @Delete('unfollow/:followeeId')
  async unfollowUser(
    @CurrentUser() user: User,
    @Param('followeeId') followeeId: string,
  ) {
    // return this.userConnectionService.unfollowUser(user.id, followeeId);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Remove follower' })
  @ApiParam({ name: 'followerId', type: String, required: true })
  @Delete('follower/remove/:followerId')
  async removeFollower(
    @CurrentUser() user: User,
    @Param('followerId') followerId: string,
  ) {
    // return this.userConnectionService.removeFollower(user.id, followerId);
  }
}
