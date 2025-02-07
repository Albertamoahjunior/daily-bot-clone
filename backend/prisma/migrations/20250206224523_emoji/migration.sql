-- CreateTable
CREATE TABLE "Emoji" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "slackName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Emoji_pkey" PRIMARY KEY ("id")
);
