-- CreateEnum
CREATE TYPE "FollowRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "follow_requests" (
    "fromUserId" UUID NOT NULL,
    "toUserId" UUID NOT NULL,
    "status" "FollowRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follow_requests_pkey" PRIMARY KEY ("fromUserId","toUserId")
);

-- CreateTable
CREATE TABLE "follows" (
    "followerId" UUID NOT NULL,
    "followeeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("followerId","followeeId")
);

-- CreateTable
CREATE TABLE "user_stats" (
    "userId" UUID NOT NULL,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "tweetsCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "lastStatsUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "follow_requests_toUserId_createdAt_idx" ON "follow_requests"("toUserId", "createdAt");

-- CreateIndex
CREATE INDEX "follow_requests_fromUserId_idx" ON "follow_requests"("fromUserId");

-- CreateIndex
CREATE INDEX "follow_requests_createdAt_idx" ON "follow_requests"("createdAt");

-- CreateIndex
CREATE INDEX "follows_followerId_createdAt_idx" ON "follows"("followerId", "createdAt");

-- CreateIndex
CREATE INDEX "follows_followeeId_createdAt_idx" ON "follows"("followeeId", "createdAt");

-- CreateIndex
CREATE INDEX "follows_followerId_idx" ON "follows"("followerId");

-- CreateIndex
CREATE INDEX "follows_followeeId_idx" ON "follows"("followeeId");

-- CreateIndex
CREATE INDEX "user_stats_followersCount_idx" ON "user_stats"("followersCount");

-- CreateIndex
CREATE INDEX "user_stats_followingCount_idx" ON "user_stats"("followingCount");

-- CreateIndex
CREATE INDEX "user_stats_tweetsCount_idx" ON "user_stats"("tweetsCount");

-- CreateIndex
CREATE INDEX "user_stats_likesCount_idx" ON "user_stats"("likesCount");

-- CreateIndex
CREATE INDEX "user_stats_commentsCount_idx" ON "user_stats"("commentsCount");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_lastActiveAt_idx" ON "User"("lastActiveAt");

-- AddForeignKey
ALTER TABLE "follow_requests" ADD CONSTRAINT "follow_requests_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_requests" ADD CONSTRAINT "follow_requests_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
