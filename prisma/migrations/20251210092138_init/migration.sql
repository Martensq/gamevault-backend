/*
  Warnings:

  - The `favorite` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `hoursPlayed` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "hoursPlayed" SET NOT NULL,
DROP COLUMN "favorite",
ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false;
