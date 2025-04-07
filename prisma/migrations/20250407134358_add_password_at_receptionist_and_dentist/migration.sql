/*
  Warnings:

  - Added the required column `password` to the `Dentist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Receptionist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dentist" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Receptionist" ADD COLUMN     "password" TEXT NOT NULL;
