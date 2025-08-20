-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'FOLLOW_REQUEST', 'FOLLOW', 'LIKE', 'COMMENT', 'REPOST', 'POST', 'REPLY', 'MENTION', 'POST_INTERACTION', 'DIRECT_MESSAGE', 'SYSTEM');

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "url" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "readAt" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "actorId" UUID,
    "entityType" TEXT,
    "entityId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "userId" UUID NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailInfo" BOOLEAN NOT NULL DEFAULT true,
    "emailFollowRequests" BOOLEAN NOT NULL DEFAULT true,
    "emailFollows" BOOLEAN NOT NULL DEFAULT true,
    "emailLikes" BOOLEAN NOT NULL DEFAULT false,
    "emailComments" BOOLEAN NOT NULL DEFAULT true,
    "emailReposts" BOOLEAN NOT NULL DEFAULT false,
    "emailPosts" BOOLEAN NOT NULL DEFAULT false,
    "emailReplies" BOOLEAN NOT NULL DEFAULT true,
    "emailMentions" BOOLEAN NOT NULL DEFAULT true,
    "emailPostInteractions" BOOLEAN NOT NULL DEFAULT true,
    "emailDirectMessages" BOOLEAN NOT NULL DEFAULT false,
    "emailSystem" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppInfo" BOOLEAN NOT NULL DEFAULT true,
    "inAppFollowRequests" BOOLEAN NOT NULL DEFAULT true,
    "inAppFollows" BOOLEAN NOT NULL DEFAULT true,
    "inAppLikes" BOOLEAN NOT NULL DEFAULT true,
    "inAppComments" BOOLEAN NOT NULL DEFAULT true,
    "inAppReposts" BOOLEAN NOT NULL DEFAULT true,
    "inAppPosts" BOOLEAN NOT NULL DEFAULT true,
    "inAppReplies" BOOLEAN NOT NULL DEFAULT true,
    "inAppMentions" BOOLEAN NOT NULL DEFAULT true,
    "inAppPostInteractions" BOOLEAN NOT NULL DEFAULT true,
    "inAppDirectMessages" BOOLEAN NOT NULL DEFAULT true,
    "inAppSystem" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushInfo" BOOLEAN NOT NULL DEFAULT false,
    "pushFollowRequests" BOOLEAN NOT NULL DEFAULT false,
    "pushFollows" BOOLEAN NOT NULL DEFAULT false,
    "pushLikes" BOOLEAN NOT NULL DEFAULT false,
    "pushComments" BOOLEAN NOT NULL DEFAULT false,
    "pushReposts" BOOLEAN NOT NULL DEFAULT false,
    "pushPosts" BOOLEAN NOT NULL DEFAULT false,
    "pushReplies" BOOLEAN NOT NULL DEFAULT false,
    "pushMentions" BOOLEAN NOT NULL DEFAULT false,
    "pushPostInteractions" BOOLEAN NOT NULL DEFAULT false,
    "pushDirectMessages" BOOLEAN NOT NULL DEFAULT false,
    "pushSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");

-- CreateIndex
CREATE INDEX "Notification_userId_status_createdAt_idx" ON "Notification"("userId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "NotificationSettings_userId_idx" ON "NotificationSettings"("userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
