import { PrismaService } from './../common/services/prisma.service';
import { Module } from '@nestjs/common';
import { UserConnectionController } from './user-connection.controller';
import { UserConnectionService } from './user-connection.service';
import { UserService } from 'src/user/user.service';
import { StorageService } from 'src/common/services/storage.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [UserConnectionController],
  providers: [
    UserConnectionService,
    PrismaService,
    UserService,
    StorageService,
    NotificationsService,
  ],
})
export class UserConnectionModule {}
