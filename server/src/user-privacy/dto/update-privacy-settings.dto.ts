import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserPrivacySettingsDto {
  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  likesVisible?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  repliesVisible?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  mediaVisible?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  avatarVisible?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  coverVisible?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  emailVisible?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  phoneVisible?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  allowTagging?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  allowMentions?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  allowDirectMessages?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  showOnlineStatus?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  showLastActiveTime?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  showTypingIndicator?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  showReadReceipts?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  filterSensitiveContent?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  filterSpamContent?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  @ApiProperty({ type: Boolean, required: false })
  filterOffensiveContent?: boolean;
}
