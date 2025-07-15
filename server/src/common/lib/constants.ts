export const EMAIL_TYPES = {
  VERIFICATION: 'verification',
  RESET_PASSWORD: 'reset_password',
  WELCOME: 'welcome',
  NOTIFICATION: 'notification',
  INVITE: 'invite',
} as const;

export type EmailType = (typeof EMAIL_TYPES)[keyof typeof EMAIL_TYPES];
