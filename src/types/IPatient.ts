/* eslint-disable @typescript-eslint/no-unused-vars */
interface IPatient{
    id: number,
    name: string,
    email: string,
    phone: string,
    createdAt: string,
    cpf: string,
    birthDate: string,
    medicalHistory: number[],
    appointments: IAppointment[],
    prescriptions: IPrescription[],
    completedAppointments: ICompletedAppointment[],
    cancelledAppointments: ICancelledAppointment[]
}