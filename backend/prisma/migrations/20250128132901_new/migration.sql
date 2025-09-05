/*
  Warnings:

  - You are about to drop the column `memberId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Team` table. All the data in the column will be lost.
  - Added the required column `memberName` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "memberId",
DROP COLUMN "name",
ADD COLUMN     "memberName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "teamId",
ALTER COLUMN "questionRefId" DROP NOT NULL;
