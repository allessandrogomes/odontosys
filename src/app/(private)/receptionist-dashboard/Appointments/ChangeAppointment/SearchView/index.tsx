
import styles from "./styles.module.scss"
import { useState } from "react"
import { SearchX } from "lucide-react"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import PatientDetailsForm from "@/components/forms/PatientDetailsForm"

interface ISearchView {
    appointmentsFound: (appointmentsFound: IAppointment[]) => void
    visible: boolean
}

type PatientResult =
    | { type: "patient"; patient: IPatient }
    | { type: "appointments"; appointments: IAppointment[] }
    | { type: "message"; message: string }

export default function SearchView({ appointmentsFound, visible }: ISearchView) {
    const [message, setMessage] = useState<string | null>(null)

    function handleResult(result: PatientResult) {
        switch (result.type) {
            case "appointments":
                appointmentsFound(result.appointments)
                setMessage(null)
                break
            
            case "message":
                setMessage(result.message || "Erro ao buscar agendamentos")
                break

            default:
                setMessage("Erro inesperado")
                break
        }
    }

    return (
        <div className={`${visible && styles.visible} ${styles.form}`}>
            <PatientDetailsForm onResult={handleResult} callType="appointment" />
            {message && <FeedbackMessage className={styles.message} message={message} icon={<SearchX />} />}
        </div>
    )
}