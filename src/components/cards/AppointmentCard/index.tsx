import styles from "./styles.module.scss"
import Card from "@/components/ui/Card"
import Label from "@/components/ui/Label"
import { formatDateISO } from "@/utils/formatDateISO"
import { formatHour } from "@/utils/formatHour"

interface IAppointmentCard {
    width?: string
    height?: string
    appointment: IAppointment
}

export default function AppointmentCard({ width = "max-content", height = "max-content", appointment }: IAppointmentCard) {
    return (
        <Card width={width} height={height} className={styles.appointmentCard}>
            <>
                <Label text="Informações da Consulta" />
                <p>Paciente: <span>{appointment.patient.name}</span></p>
                <p>Procedimento: <span>{appointment.procedure}</span></p>
                <p>Dentista: <span>Dr. {appointment.dentist.name}</span></p>
                <p>Dia: <span>{formatDateISO(appointment.scheduledAt)}</span></p>
                <p>Horário: <span>{formatHour(appointment.scheduledAt!)} - {formatHour(appointment.endsAt!)}</span></p>
                <p>Duração: <span>{appointment.durationMinutes} Minutos</span></p>
            </>
        </Card>
    )
}