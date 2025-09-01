import { ApiProperty } from '@nestjs/swagger';
import { UserAccountType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UpdateUserAccountTypeDto {
  @IsString({ message: 'Account type must be a string' })
  @IsEnum(UserAccountType, { message: 'Invalid account type' })
  @ApiProperty({ type: String, enum: UserAccountType, required: true })
  accountType: UserAccountType;
}
