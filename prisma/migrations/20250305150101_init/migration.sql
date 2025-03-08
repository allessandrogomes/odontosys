-- CreateTable
CREATE TABLE "Receptionist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receptionist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dentist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "croNumber" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "appointments" INTEGER[],

    CONSTRAINT "Dentist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "medicalHistory" INTEGER[],

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Receptionist_email_key" ON "Receptionist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Receptionist_phone_key" ON "Receptionist"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Receptionist_cpf_key" ON "Receptionist"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_email_key" ON "Dentist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_phone_key" ON "Dentist"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_cpf_key" ON "Dentist"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_croNumber_key" ON "Dentist"("croNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_key" ON "Patient"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_cpf_key" ON "Patient"("cpf");
