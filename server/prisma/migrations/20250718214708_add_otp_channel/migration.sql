-- CreateEnum
CREATE TYPE "OtpChannel" AS ENUM ('EMAIL', 'SMS');

-- AlterTable
ALTER TABLE "OtpVerification" ADD COLUMN     "channel" "OtpChannel" NOT NULL DEFAULT 'EMAIL';
