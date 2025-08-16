import { useState } from "react"
import styles from "./styles.module.scss"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import { Info, SearchX } from "lucide-react"
import PatientDetailsForm from "@/components/forms/PatientDetailsForm"
import { useSearchAppointmentContext } from "@/contexts/SearchAppointmentContext"

type PatientDetailsResult =
    | { type: "patient"; patient: IPatient }
    | { type: "appointments"; appointments: IAppointment[] }
    | { type: "message"; message: string }

const INITIAL_MESSAGE = "Digite um CPF e clique em Buscar para encontrar consultas..."

export default function SearchField() {
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(INITIAL_MESSAGE)
    const { dispatch } = useSearchAppointmentContext()

    function handleResult(result: PatientDetailsResult) {
        switch (result.type) {
            case "appointments":
                dispatch({ type: "SET_APPOINTMENTS", payload: result.appointments })
                setFeedbackMessage(null)

                dispatch({ type: "SET_STEP", payload: 2 })
                break

            case "message":
                setFeedbackMessage(result.message || "Erro ao buscar consultas")
                break

            // Não deveria ocorrer, mas garante que o tipo está coberto
            default:
                setFeedbackMessage("Erro inesperado")
                break
        }
    }

    return (
        <div className={styles.container} aria-live="polite" aria-atomic="true" >
            <PatientDetailsForm onResult={handleResult} callType="appointment" />
            {feedbackMessage &&
                <FeedbackMessage
                    className={styles.message}
                    icon={feedbackMessage === INITIAL_MESSAGE ? <Info data-testid="info-icon" /> : <SearchX data-testid="error-icon" />}
                    message={feedbackMessage}
                />
            }
        </div>
    )
}