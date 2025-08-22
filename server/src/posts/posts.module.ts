import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from 'src/user/user.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { StorageService } from 'src/common/services/storage.service';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    PrismaService,
    UserService,
    NotificationsService,
    StorageService,
  ],
  exports: [PostsService],
})
export class PostsModule {}
