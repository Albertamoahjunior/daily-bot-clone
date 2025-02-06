/*
  Warnings:

  - You are about to drop the column `email` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `answers` on the `Standup` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Standup` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `Standup` table. All the data in the column will be lost.
  - You are about to drop the column `responded` on the `Standup` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId]` on the table `Standup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionRefId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamName` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_teamId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "email",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Standup" DROP COLUMN "answers",
DROP COLUMN "date",
DROP COLUMN "questions",
DROP COLUMN "responded",
ADD COLUMN     "reminderTimes" TEXT[],
ADD COLUMN     "standupDays" TEXT[],
ADD COLUMN     "standupTimes" TEXT[];

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "name",
ADD COLUMN     "questionRefId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "teamId" TEXT NOT NULL,
ADD COLUMN     "teamName" TEXT NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "StandupResponse" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "StandupResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollResponse" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PollResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandupQuestion" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" TEXT[],
    "questionType" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,

    CONSTRAINT "StandupQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollQuestion" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PollQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kudos" (
    "id" TEXT NOT NULL,
    "giverId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoodResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Standup_teamId_key" ON "Standup"("teamId");

-- AddForeignKey
ALTER TABLE "StandupResponse" ADD CONSTRAINT "StandupResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "StandupQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollResponse" ADD CONSTRAINT "PollResponse_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "PollQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudos" ADD CONSTRAINT "Kudos_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kudos" ADD CONSTRAINT "Kudos_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodResponse" ADD CONSTRAINT "MoodResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodResponse" ADD CONSTRAINT "MoodResponse_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
