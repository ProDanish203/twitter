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
