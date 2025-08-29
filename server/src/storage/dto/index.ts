import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class UploadFileDto {
  @IsString()
  @IsNotEmpty({ message: 'Filename should not be empty' })
  @MaxLength(255, { message: 'Filename too long' })
  @ApiProperty({ type: String, required: true, example: 'image.jpeg' })
  filename: string;

  @IsString()
  @IsNotEmpty({ message: 'Filetype should not be empty' })
  @ApiProperty({ type: String, required: true, example: 'image/jpeg' })
  filetype: string;
}

export class GeneratePresignedUploadUrlDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one file must be specified' })
  @IsNotEmpty({ message: 'Files should not be empty' })
  @ValidateNested({ each: true })
  @Type(() => UploadFileDto)
  @ApiProperty({
    type: [UploadFileDto],
    required: true,
    minItems: 1,
    maxItems: 20,
    example: [{ filename: 'image1.jpeg', filetype: 'image/jpeg' }],
  })
  files: UploadFileDto[];
}
