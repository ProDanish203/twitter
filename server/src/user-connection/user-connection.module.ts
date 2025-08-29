import { PrismaService } from './../common/services/prisma.service';
import { Module } from '@nestjs/common';
import { UserConnectionController } from './user-connection.controller';
import { UserConnectionService } from './user-connection.service';
import { UserService } from 'src/user/user.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [UserConnectionController],
  providers: [
    UserConnectionService,
    PrismaService,
    UserService,
    NotificationsService,
  ],
})
export class UserConnectionModule {}
