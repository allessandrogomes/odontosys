import styles from "./styles.module.scss"
import AppointmentList from "@/components/lists/AppointmentList"

interface IAppointmentsFound {
    appointments: IAppointment[] | []
    selectedAppointment: (appointment: IAppointment) => void
    visible: boolean
}

export default function AppointmentsFound({ appointments, selectedAppointment, visible }: IAppointmentsFound) {
    return (
        appointments.length > 0 ? (
            <div className={`${styles.appointmentsFound} ${visible && styles.visible}`}>
                <p className={styles.patientName}>Paciente: <span>{appointments[0].patient.name}</span></p>
                <AppointmentList appointments={appointments} selectedAppointment={appointment => selectedAppointment(appointment)} />
            </div>
        ) : null
    )
}