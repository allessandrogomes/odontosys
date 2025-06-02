import { formatDateISO } from "@/utils/formatDateISO"
import styles from "./styles.module.scss"
import { formatHour } from "@/utils/formatHour"
import { FaArrowLeft } from "react-icons/fa"

interface IAppointmentInformation {
    appointment: IAppointment
    onBack: (onBack: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export default function AppointmentInformation({ appointment, onBack }: IAppointmentInformation) {
    return (
        <div className={styles.appointmentInformation}>
            <button onClick={onBack} className={styles.backBtn}><FaArrowLeft />Voltar</button>
                <h2>Informações da Consulta</h2>
                <p>Paciente: <span>{appointment.patient.name}</span></p>
                <p>Dentista: <span>Dr. {appointment.dentist.name}</span></p>
                <p>Procedimento: <span>{appointment.procedure}</span></p>
                <p>Data: <span>{formatDateISO(appointment.scheduledAt)}</span></p>
                <p>Horário: <span>{formatHour(appointment.scheduledAt)} - {formatHour(appointment.endsAt)}</span></p>
                <p>Duração: <span>{appointment.durationMinutes} Minutos</span></p>
                <p>Status: <span>{appointment.status}</span></p>
        </div>
    )
}