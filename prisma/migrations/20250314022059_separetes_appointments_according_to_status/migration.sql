/*
  Warnings:

  - The `status` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('AGENDADA', 'CONCLUIDA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "status",
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'AGENDADA';

-- CreateTable
CREATE TABLE "CompletedAppointment" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "dentistId" INTEGER NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "procedure" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'CONCLUIDA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompletedAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CancelledAppointment" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "dentistId" INTEGER NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "procedure" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'CONCLUIDA',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CancelledAppointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompletedAppointment" ADD CONSTRAINT "CompletedAppointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedAppointment" ADD CONSTRAINT "CompletedAppointment_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CancelledAppointment" ADD CONSTRAINT "CancelledAppointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CancelledAppointment" ADD CONSTRAINT "CancelledAppointment_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
