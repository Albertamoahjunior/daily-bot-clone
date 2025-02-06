/*
  Warnings:

  - You are about to drop the column `teamId` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "teamId",
ADD COLUMN     "teams" TEXT[];
