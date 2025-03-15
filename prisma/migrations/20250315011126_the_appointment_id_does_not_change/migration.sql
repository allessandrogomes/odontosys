-- AlterTable
ALTER TABLE "CancelledAppointment" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "CancelledAppointment_id_seq";

-- AlterTable
ALTER TABLE "CompletedAppointment" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "CompletedAppointment_id_seq";
