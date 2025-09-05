/*
  Warnings:

  - Added the required column `emojiId` to the `Mood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mood" ADD COLUMN     "emojiId" TEXT NOT NULL;
