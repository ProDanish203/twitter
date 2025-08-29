import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google-oauth.strategy';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserModule } from 'src/user/user.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    StorageModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, GoogleStrategy, NotificationsService],
})
export class AuthModule {}
