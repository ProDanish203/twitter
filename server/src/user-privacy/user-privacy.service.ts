import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { throwError } from 'src/common/utils/helpers';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserPrivacyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async updateAccountType(user: User) {
    try {
    } catch (err) {
      throw throwError(
        err.message || 'Failed to update account type',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
