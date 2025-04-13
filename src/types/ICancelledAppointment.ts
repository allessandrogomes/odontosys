/* eslint-disable @typescript-eslint/no-unused-vars */
interface ICancelledAppointment {
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
    reason?: string,
    createdAt: string
}