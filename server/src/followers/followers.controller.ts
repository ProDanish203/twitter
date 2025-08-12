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
import { FollowersService } from './followers.service';
import { ApiTags, ApiProperty, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User, UserRole } from '@prisma/client';
import {
  RespondToFollowRequestDto,
  SendFollowRequestDto,
} from './dto/requests.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@ApiTags('Followers')
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Send Follow Request', type: SendFollowRequestDto })
  @Post('send-request')
  async sendFollowRequest(
    @CurrentUser() user: User,
    @Body() dto: SendFollowRequestDto,
  ) {
    // return this.followersService.sendFollowRequest(dto);
  }

  @Roles(UserRole.USER)
  @ApiProperty({
    title: 'Respond to Follow Request',
    type: RespondToFollowRequestDto,
  })
  @ApiParam({ name: 'requestId', type: String, required: true })
  @Patch('respond-request/:requestId')
  async respondToFollowRequest(
    @CurrentUser() user: User,
    @Body() dto: RespondToFollowRequestDto,
    @Param('requestId') requestId: string,
  ) {
    // return this.followersService.sendFollowRequest(dto);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Get Sent Follow Requests' })
  @Get('requests/sent')
  async getSentFollowRequests(@CurrentUser() user: User) {
    // return this.followersService.getSentFollowRequests(user.id);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Get Received Follow Requests' })
  @Get('requests/received')
  async getReceivedFollowRequests(@CurrentUser() user: User) {
    // return this.followersService.getReceivedFollowRequests(user.id);
  }

  @Roles(UserRole.USER)
  @ApiProperty({ title: 'Revoke Follow Request' })
  @ApiParam({ name: 'requestId', type: String, required: true })
  @Delete('revoke-request/:requestId')
  async revokeFollowRequest(
    @CurrentUser() user: User,
    @Param('requestId') requestId: string,
  ) {
    // return this.followersService.revokeFollowRequest(user.id, requestId);
  }
}
