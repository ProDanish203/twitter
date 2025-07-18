export const EMAIL_TYPES = {
  VERIFICATION: 'verification',
  RESET_PASSWORD: 'reset_password',
  WELCOME: 'welcome',
  NOTIFICATION: 'notification',
  INVITE: 'invite',
} as const;

export type EmailType = (typeof EMAIL_TYPES)[keyof typeof EMAIL_TYPES];

export const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5; // Maximum attempts for OTP verification
export const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
export const RATE_LIMIT_MAX_REQUESTS = 5; // Maximum requests in the rate limit window
