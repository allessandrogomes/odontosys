-- CreateTable
CREATE TABLE "Procedure" (
    "id" SERIAL NOT NULL,
    "procedure" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);
