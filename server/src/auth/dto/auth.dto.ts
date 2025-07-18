import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => value.trim().toLowerCase())
  @ApiProperty({
    type: String,
    required: true,
    example: 'theonlyadmin',
  })
  username: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({
    type: String,
    required: true,
    example: 'Danish Siddiqui',
  })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @ApiProperty({
    type: String,
    required: true,
    example: 'danishsidd203@gmail.com',
  })
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
  @ApiProperty({
    type: String,
    required: true,
    example: 'Abc12345%',
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid user role' })
  @ApiProperty({
    type: String,
    enum: UserRole,
    required: false,
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER; // Default to USER role
}

export class LoginUserDto {
  // can either be username or email
  @IsNotEmpty({ message: 'Username or email is required' })
  @IsString({ message: 'Username or email must be a string' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @ApiProperty({
    type: String,
    required: true,
    example: 'theonlyadmin',
  })
  entity: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @ApiProperty({
    type: String,
    required: true,
    example: 'Abc12345%',
  })
  password: string;
}
