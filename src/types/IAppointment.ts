/* eslint-disable @typescript-eslint/no-unused-vars */
interface IAppointment {
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