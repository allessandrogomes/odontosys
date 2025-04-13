/* eslint-disable @typescript-eslint/no-unused-vars */
interface IDentist {
    id: number,
    name: string,
    email: string,
    phone: string,
    createdAt: string,
    cpf: string,
    password: string,
    role: string,
    birthDate: string,
    croNumber: string,
    specialty: string,
    appointments: IAppointment[],
    prescriptions: IPrescription[],
    completedAppointments: ICompletedAppointment[],
    cancelledAppointments: ICancelledAppointment[],
    blockedTimes: IBlockedTime[]
}