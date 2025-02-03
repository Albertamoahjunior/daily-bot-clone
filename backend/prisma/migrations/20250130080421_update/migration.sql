/*
  Warnings:

  - Added the required column `teamId` to the `StandupResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StandupResponse" ADD COLUMN     "teamId" TEXT NOT NULL;
