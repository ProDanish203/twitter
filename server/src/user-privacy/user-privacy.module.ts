import { Module } from '@nestjs/common';
import { UserPrivacyController } from './user-privacy.controller';
import { UserPrivacyService } from './user-privacy.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [UserPrivacyController],
  providers: [
    UserPrivacyService,
    PrismaService,
    NotificationsService,
    UserService,
  ],
})
export class UserPrivacyModule {}
