/*
  Warnings:

  - You are about to drop the column `instructions` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `Prescription` table. All the data in the column will be lost.
  - Added the required column `prescriptionDetails` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "instructions",
DROP COLUMN "medications",
ADD COLUMN     "prescriptionDetails" TEXT NOT NULL;
