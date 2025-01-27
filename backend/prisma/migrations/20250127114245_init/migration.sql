-- CreateTable
CREATE TABLE "Standup" (
    "id" SERIAL NOT NULL,
    "questions" JSONB NOT NULL,
    "answers" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,
    "responded" TEXT[],

    CONSTRAINT "Standup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "members" TEXT[],

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Standup" ADD CONSTRAINT "Standup_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
