/*
  Warnings:

  - The `answer` column on the `PollResponse` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PollQuestion" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PollResponse" DROP COLUMN "answer",
ADD COLUMN     "answer" TEXT[];
