import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({
    type: String,
    required: false,
    example: 'Danish Siddiqui',
  })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @ApiProperty({
    type: String,
    required: false,
    example: 'danishsidd203@gmail.com',
  })
  email?: string;

  @IsOptional()
  @IsString({ message: 'bio must be a string' })
  @ApiProperty({
    type: String,
    required: false,
    example: 'Software Engineer and Tech Enthusiast',
  })
  bio?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be a valid gender' })
  @ApiProperty({
    type: String,
    enum: Gender,
    required: false,
  })
  gender?: Gender;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @ApiProperty({
    type: String,
    required: false,
    example: 'Karachi',
  })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  @ApiProperty({
    type: String,
    required: false,
    example: 'Pakistan',
  })
  country?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    required: false,
    example: '1990-01-01',
  })
  birthDate?: Date;
}
