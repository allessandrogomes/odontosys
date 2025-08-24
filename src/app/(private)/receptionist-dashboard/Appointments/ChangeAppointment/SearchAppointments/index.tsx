import styles from "./styles.module.scss"
import { useState } from "react"
import { SearchX } from "lucide-react"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import PatientDetailsForm from "@/components/forms/PatientDetailsForm"
import { useChangeAppointmentContext } from "@/contexts/ChangeAppointmentContext"

type SearchResult =
    | { type: "patient"; patient: IPatient }
    | { type: "appointments"; appointments: IAppointment[] }
    | { type: "message"; message: string }

export default function SearchAppointments() {
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
    const { dispatch } = useChangeAppointmentContext()


    function handleResult(result: SearchResult) {
        switch (result.type) {
            case "appointments":
                dispatch({ type: "SET_APPOINTMENTS", payload: result.appointments })
                dispatch({ type: "SET_STEP", payload: 2 })
                setFeedbackMessage(null)
                break
            
            case "message":
                setFeedbackMessage(result.message)
                break

            // Não deveria ocorrer, mas está coberto pelo tipo
            default:
                setFeedbackMessage("Erro inesperado, tente novamente")
                break
        }
    }

    return (
        <div className={styles.form}>
            <PatientDetailsForm onResult={handleResult} callType="appointment" />
            {feedbackMessage && <FeedbackMessage className={styles.message} message={feedbackMessage} icon={<SearchX />} />}
        </div>
    )
}