/*
  Warnings:

  - A unique constraint covering the columns `[userId,url]` on the table `links` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `links` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "links_url_key";

-- AlterTable
ALTER TABLE "links" ADD COLUMN     "embedHtml" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_shareId_key" ON "users"("shareId");

-- CreateIndex
CREATE UNIQUE INDEX "links_userId_url_key" ON "links"("userId", "url");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
