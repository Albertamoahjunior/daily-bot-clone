/*
  Warnings:

  - You are about to drop the `_TeamMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "teams" TEXT[];

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "members" TEXT[];

-- DropTable
DROP TABLE "_TeamMembers";
