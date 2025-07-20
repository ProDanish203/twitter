import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { GoogleUser } from './../types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { id, name, emails, photos } = profile;
      const user: GoogleUser = {
        email: emails[0].value,
        provider: 'google',
        providerId: id,
        name: `${name.givenName} ${name.familyName}`.trim(),
        avatar: photos[0].value,
        accessToken,
        refreshToken,
      };
      done(null, user);
    } catch (error) {
      Logger.error('Google Strategy Error:', error);
      done(
        new InternalServerErrorException('Failed to validate Google user'),
        false,
      );
    }
  }
}
