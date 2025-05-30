import { formatHour } from "@/utils/formatHour"
import styles from "./styles.module.scss"
import { formatDateISO } from "@/utils/formatDateISO"

interface IAppointmentsFound {
    appointments: IAppointment[] | []
    selectedAppointment: (appointment: IAppointment) => void
    visible: boolean
}

export default function AppointmentsFound({ appointments, selectedAppointment, visible }: IAppointmentsFound) {
    return (
        <ul className={`${visible && styles.visible} ${styles.appointmentsFound}`}>
            <p className={styles.patientName}>Paciente: <span>{appointments[0].patient.name}</span></p>
            {appointments.map(appointment => (
                <li key={appointment.id} onClick={() => selectedAppointment(appointment)}>
                    <p>{appointment.procedure}</p>
                    <p>{formatDateISO(appointment.scheduledAt)}</p>
                    <p>{formatHour(appointment.scheduledAt)} - {formatHour(appointment.endsAt)}</p>
                </li>
            ))
            }
        </ul>
    )
}