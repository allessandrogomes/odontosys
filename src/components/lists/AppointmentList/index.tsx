import { formatDateISO } from "@/utils/formatDateISO"
import styles from "./styles.module.scss"
import { formatHour } from "@/utils/formatHour"
import { Dot } from "lucide-react"

interface IAppointmentList {
    appointments: IAppointment[]
    selectedAppointment: (appointment: IAppointment) => void
}

export default function AppointmentList({ appointments, selectedAppointment }: IAppointmentList) {
    return (
        <ul className={styles.appointmentList}>
            {appointments.map(appointment => (
                <li key={appointment.id}>
                    <button onClick={() => selectedAppointment(appointment)}>
                        <p>{appointment.procedure}</p>
                        <Dot className={styles.separatorIcon} />
                        <p>{formatDateISO(appointment.scheduledAt)}</p>
                        <Dot className={styles.separatorIcon} />
                        <p>{formatHour(appointment.scheduledAt)} - {formatHour(appointment.endsAt)}</p>
                    </button>
                </li>
            ))
            }
        </ul>
    )
}