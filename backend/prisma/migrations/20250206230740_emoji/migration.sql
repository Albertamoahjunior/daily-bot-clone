/*
  Warnings:

  - Added the required column `moodScore` to the `Mood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mood" ADD COLUMN     "moodScore" INTEGER NOT NULL;
