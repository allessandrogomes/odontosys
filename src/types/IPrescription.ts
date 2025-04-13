/* eslint-disable @typescript-eslint/no-unused-vars */
interface IPrescription {
    id: number,
    patient: IPatient,
    patientId: number,
    dentist: IDentist,
    dentistId: number,
    prescriptionDetails: string,
    createdAt: string
}