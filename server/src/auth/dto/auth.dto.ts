import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @IsStrongPassword(
    {
      minLength: 6,
      minSymbols: 1,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
    },
    { message: 'Password must be strong' },
  )
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid user role' })
  role: UserRole = UserRole.USER; // Default to USER role
}

export class LoginUserDto {
  // can either be username or email
  @IsNotEmpty({ message: 'Username or email is required' })
  @IsString({ message: 'Username or email must be a string' })
  entity: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
