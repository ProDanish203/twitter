import { UserPrivacy } from '@prisma/client';

export type UserPrivacySettingFields = Omit<
  UserPrivacy,
  'userId' | 'user' | 'accountType'
>;

export type ContentVisibilityFields = keyof Pick<
  UserPrivacySettingFields,
  'likesVisible' | 'repliesVisible' | 'mediaVisible'
>;

export type ProfileVisibilityFields = keyof Pick<
  UserPrivacySettingFields,
  'avatarVisible' | 'coverVisible' | 'emailVisible' | 'phoneVisible'
>;

export type InteractionSettingsFields = keyof Pick<
  UserPrivacySettingFields,
  'allowTagging' | 'allowMentions' | 'allowDirectMessages'
>;

export type ActivitySettingsFields = keyof Pick<
  UserPrivacySettingFields,
  | 'showOnlineStatus'
  | 'showLastActiveTime'
  | 'showTypingIndicator'
  | 'showReadReceipts'
>;

export type ContentFilteringFields = keyof Pick<
  UserPrivacySettingFields,
  'filterSensitiveContent' | 'filterSpamContent' | 'filterOffensiveContent'
>;
