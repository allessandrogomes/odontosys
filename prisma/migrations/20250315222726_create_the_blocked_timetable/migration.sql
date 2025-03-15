-- CreateTable
CREATE TABLE "BlockedTime" (
    "id" SERIAL NOT NULL,
    "blockedTime" TIMESTAMP(3) NOT NULL,
    "dentistId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlockedTime" ADD CONSTRAINT "BlockedTime_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
