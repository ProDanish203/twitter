import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StorageService } from 'src/common/services/storage.service';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, StorageService],
})
export class UserModule {}
