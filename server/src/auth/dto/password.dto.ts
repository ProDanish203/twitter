import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  // can either be email or phone number
  @IsNotEmpty({ message: 'Email or phone number is required' })
  @IsString({ message: 'Email or phone number must be a string' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @ApiProperty({
    type: String,
    required: true,
    example: 'danishsidd203@gmail.com',
  })
  identifier: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @ApiProperty({
    type: String,
    required: true,
    example: 'Abc12345%',
  })
  newPassword: string;

  @IsNotEmpty({ message: 'Reset token is required' })
  @IsString({ message: 'Reset token must be a string' })
  @ApiProperty({
    type: String,
    required: true,
    example: 'reset-token-example',
  })
  resetToken: string;
}