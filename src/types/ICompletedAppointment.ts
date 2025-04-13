/* eslint-disable @typescript-eslint/no-unused-vars */
interface ICompletedAppointment {
    id: number,
    patient: IPatient,
    patientId: number,
    dentist: IDentist,
    dentistId: number,
    scheduledAt: string,
    endsAt: string,
    durationMinutes: number,
    procedure: string,
    status: EAppointmentStatus,
    createdAt: string
}