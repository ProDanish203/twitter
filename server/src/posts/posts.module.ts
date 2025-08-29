import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from 'src/user/user.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [PostsController],
  providers: [PostsService, PrismaService, UserService, NotificationsService],
  exports: [PostsService],
})
export class PostsModule {}
