import { User, UserRole } from '@prisma/client';

export type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
};

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterUserResponse {
  user: User;
  token: string;
}

export interface LoginUserResponse {
  user: User;
  token: string;
}
