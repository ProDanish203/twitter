import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
