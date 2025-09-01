-- CreateEnum
CREATE TYPE "UserAccountType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "user_privacy" (
    "userId" UUID NOT NULL,
    "accountType" "UserAccountType" NOT NULL DEFAULT 'PUBLIC',
    "likesVisible" BOOLEAN NOT NULL DEFAULT true,
    "repliesVisible" BOOLEAN NOT NULL DEFAULT true,
    "mediaVisible" BOOLEAN NOT NULL DEFAULT true,
    "avatarVisible" BOOLEAN NOT NULL DEFAULT true,
    "coverVisible" BOOLEAN NOT NULL DEFAULT true,
    "emailVisible" BOOLEAN NOT NULL DEFAULT true,
    "phoneVisible" BOOLEAN NOT NULL DEFAULT true,
    "allowTagging" BOOLEAN NOT NULL DEFAULT true,
    "allowMentions" BOOLEAN NOT NULL DEFAULT true,
    "allowDirectMessages" BOOLEAN NOT NULL DEFAULT true,
    "showOnlineStatus" BOOLEAN NOT NULL DEFAULT true,
    "showLastActiveTime" BOOLEAN NOT NULL DEFAULT false,
    "showTypingIndicator" BOOLEAN NOT NULL DEFAULT true,
    "showReadReceipts" BOOLEAN NOT NULL DEFAULT true,
    "filterSensitiveContent" BOOLEAN NOT NULL DEFAULT true,
    "filterSpamContent" BOOLEAN NOT NULL DEFAULT true,
    "filterOffensiveContent" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "user_privacy_userId_key" ON "user_privacy"("userId");

-- CreateIndex
CREATE INDEX "user_privacy_userId_idx" ON "user_privacy"("userId");

-- CreateIndex
CREATE INDEX "user_privacy_accountType_idx" ON "user_privacy"("accountType");

-- AddForeignKey
ALTER TABLE "user_privacy" ADD CONSTRAINT "user_privacy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
