import { Controller, Get, Post, Put, Patch, Delete, UseGuards } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { ApiTags, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(AuthGuard)
@ApiTags('Followers')
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}
}
