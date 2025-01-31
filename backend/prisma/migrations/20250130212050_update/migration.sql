/*
  Warnings:

  - Added the required column `teamId` to the `PollResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PollResponse" ADD COLUMN     "teamId" TEXT NOT NULL;
