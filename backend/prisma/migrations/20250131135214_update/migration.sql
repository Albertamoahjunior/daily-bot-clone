/*
  Warnings:

  - Added the required column `choiceType` to the `PollQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PollQuestion" ADD COLUMN     "choiceType" TEXT NOT NULL;
