import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from 'src/user/user.service';
import { StorageService } from 'src/common/services/storage.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, UserService, StorageService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
