import { ApiProperty } from '@nestjs/swagger';
import { FollowRequestStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SendFollowRequestDto {
  @IsString({ message: 'User Id must be a string' })
  @IsNotEmpty({ message: 'User Id must not be empty' })
  @ApiProperty({ type: String, required: true })
  toUserId: string;
}

export class RespondToFollowRequestDto {
  @IsString({ message: 'Status must be a string' })
  @IsNotEmpty({ message: 'Status must not be empty' })
  @IsEnum(FollowRequestStatus, { message: 'Status must be a valid enum value' })
  @ApiProperty({ type: String, required: true, enum: FollowRequestStatus })
  status: FollowRequestStatus;
}
