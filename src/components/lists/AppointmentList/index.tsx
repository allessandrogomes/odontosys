import { formatDateISO } from "@/utils/formatDateISO"
import styles from "./styles.module.scss"
import { formatHour } from "@/utils/formatHour"
import { Dot } from "lucide-react"
import { useSearchAppointmentContext } from "@/contexts/SearchAppointmentContext"

export default function AppointmentList() {
    const { dispatch, state } = useSearchAppointmentContext()
    const appointments: IAppointment[] | [] | null = state.appointments

    function handleSelectedAppointment(appointment: IAppointment) {
        dispatch({ type: "SET_SELECTED_APPOINTMENT", payload: appointment })
        dispatch({ type: "SET_STEP", payload: 3 })
    }

    return (
        <ul className={styles.appointmentList}>
            {appointments && appointments.length > 0 && appointments.map(appointment => (
                <li key={appointment.id}>
                    <button onClick={() => handleSelectedAppointment(appointment)}>
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