import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [FeedController],
  providers: [FeedService, PrismaService, StorageService, UserService],
  exports: [FeedService],
})
export class FeedModule {}
