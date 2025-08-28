import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserConnectionModule } from './user-connection/user-connection.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { FeedModule } from './feed/feed.module';
import { UserPrivacyModule } from './user-privacy/user-privacy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    UserConnectionModule,
    NotificationsModule,
    PostsModule,
    FeedModule,
    UserPrivacyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
