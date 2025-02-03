/*
  Warnings:

  - You are about to drop the column `mood` on the `MoodResponse` table. All the data in the column will be lost.
  - Added the required column `moodId` to the `MoodResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoodResponse" DROP COLUMN "mood",
ADD COLUMN     "moodId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Mood" (
    "id" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);
