/*
  Warnings:

  - Added the required column `role` to the `Dentist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Receptionist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dentist" ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Receptionist" ADD COLUMN     "role" TEXT NOT NULL;
