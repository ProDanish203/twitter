import { Module } from '@nestjs/common';
import { UserPrivacyController } from './user-privacy.controller';
import { UserPrivacyService } from './user-privacy.service';

@Module({
  controllers: [UserPrivacyController],
  providers: [UserPrivacyService]
})
export class UserPrivacyModule {}
