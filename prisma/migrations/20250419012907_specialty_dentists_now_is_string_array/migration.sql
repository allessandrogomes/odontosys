/*
  Warnings:

  - The `specialty` column on the `Dentist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Dentist" DROP COLUMN "specialty",
ADD COLUMN     "specialty" TEXT[];
