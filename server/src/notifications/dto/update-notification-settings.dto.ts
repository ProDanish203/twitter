import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationSettingsDto {
  // Email Notifications
  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailEnabled?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailInfo?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailFollowRequests?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailFollows?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailLikes?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailComments?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailReposts?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailPosts?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailReplies?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailMentions?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailPostInteractions?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailDirectMessages?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  emailSystem?: boolean;

  // In App Notifications
  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppEnabled?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppInfo?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppFollowRequests?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppFollows?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppLikes?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppComments?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppReposts?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppPosts?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppReplies?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppMentions?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppPostInteractions?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppDirectMessages?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  inAppSystem?: boolean;

  // Push Notifications
  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushEnabled?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushInfo?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushFollowRequests?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushFollows?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushLikes?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushComments?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushReposts?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushPosts?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushReplies?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushMentions?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushPostInteractions?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushDirectMessages?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Must be a boolean' })
  @IsOptional()
  pushSystem?: boolean;
}
