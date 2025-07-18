import { HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

export function throwError(
  message: string | any,
  statuscode?: number,
): HttpException {
  return new HttpException(
    message,
    statuscode || HttpStatus.INTERNAL_SERVER_ERROR,
  );
}

export function getRandomFilename(byteLength: number = 32): string {
  return crypto.randomBytes(byteLength).toString('hex');
}

export const generateSecureOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randIndex = crypto.randomInt(0, digits.length);
    otp += digits[randIndex];
  }
  return otp;
};
