import { Module } from '@nestjs/common';
import { UserConnectionController } from './user-connection.controller';
import { UserConnectionService } from './user-connection.service';

@Module({
  controllers: [UserConnectionController],
  providers: [UserConnectionService],
})
export class UserConnectionModule {}
