/*
  Warnings:

  - Made the column `reason` on table `CancelledAppointment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CancelledAppointment" ALTER COLUMN "status" SET DEFAULT 'CANCELADA',
ALTER COLUMN "reason" SET NOT NULL;
