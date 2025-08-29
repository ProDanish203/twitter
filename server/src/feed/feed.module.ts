import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from 'src/user/user.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [FeedController],
  providers: [FeedService, PrismaService, UserService],
  exports: [FeedService],
})
export class FeedModule {}
