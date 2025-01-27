/*
  Warnings:

  - The primary key for the `Standup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `members` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Standup" DROP CONSTRAINT "Standup_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Standup_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Standup_id_seq";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "members";

-- CreateTable
CREATE TABLE "Members" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
