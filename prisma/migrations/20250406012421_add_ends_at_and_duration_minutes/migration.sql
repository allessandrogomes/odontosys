/*
  Warnings:

  - You are about to drop the column `blockedTime` on the `BlockedTime` table. All the data in the column will be lost.
  - Added the required column `durationMinutes` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endsAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endOfBlockedTime` to the `BlockedTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startOfBlockedTime` to the `BlockedTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMinutes` to the `CancelledAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endsAt` to the `CancelledAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMinutes` to the `CompletedAppointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endsAt` to the `CompletedAppointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "BlockedTime" DROP COLUMN "blockedTime",
ADD COLUMN     "endOfBlockedTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startOfBlockedTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CancelledAppointment" ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CompletedAppointment" ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL;
