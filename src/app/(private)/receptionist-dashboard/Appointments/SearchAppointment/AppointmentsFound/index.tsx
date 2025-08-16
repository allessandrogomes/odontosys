import { useSearchAppointmentContext } from "@/contexts/SearchAppointmentContext"
import styles from "./styles.module.scss"
import AppointmentList from "@/components/lists/AppointmentList"
import BackBtn from "@/components/ui/BackBtn"

export default function AppointmentsFound() {
    const { dispatch, state } = useSearchAppointmentContext()
    const appointments: IAppointment[] | [] | null = state.appointments

    function handleBack() {
        dispatch({ type: "SET_APPOINTMENTS", payload: null })
        dispatch({ type: "SET_STEP", payload: 1 })
    }

    return (
        appointments && appointments.length > 0 ? (
            <div className={styles.container}>
                <p className={styles.patientName}>Paciente: <span>{appointments[0].patient.name}</span></p>
                <AppointmentList />
                <BackBtn onClick={handleBack}/>
            </div>
        ) : null
    )
}