-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "wasCommentFor" UUID,
ADD COLUMN     "wasRepostFor" UUID;
