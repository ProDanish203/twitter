import { ApiProperty } from '@nestjs/swagger';
import { OtpChannel, OtpType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'danishsidd203@gmail.com',
  })
  @IsString({ message: 'Identifier must be a string' })
  @IsNotEmpty({ message: 'Identifier is required' })
  @Transform(({ value }) => value.trim().toLowerCase())
  identifier: string;

  @ApiProperty({
    type: String,
    enum: OtpType,
    required: true,
    example: OtpType.EMAIL_VERIFICATION,
  })
  @IsString({ message: 'Type must be a string' })
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(OtpType, { message: 'Type must be a valid OtpType' })
  type: OtpType;

  @ApiProperty({
    type: String,
    enum: OtpChannel,
    required: true,
    default: OtpChannel.EMAIL,
  })
  @IsString({ message: 'OTP channel must be a string' })
  @IsEnum(OtpChannel, { message: 'OTP channel must be a valid OtpChannel' })
  otpChannel: OtpChannel = OtpChannel.EMAIL; // Default to EMAIL if not provided
}

export class VerifyOtpDto extends SendOtpDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '123456',
  })
  @IsString({ message: 'OTP must be a string' })
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
}
