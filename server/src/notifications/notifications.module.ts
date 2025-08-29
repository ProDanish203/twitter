import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from 'src/user/user.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, UserService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
