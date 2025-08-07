import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserNameDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @ApiProperty({
    type: String,
    required: true,
    example: 'danishsidd203',
  })
  username: string;
}
