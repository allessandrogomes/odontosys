import styles from "./styles.module.scss"
import { useState } from "react"
import { UserX } from "lucide-react"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import PatientDetailsForm from "@/components/forms/PatientDetailsForm"

interface ISearchForm {
    visible: boolean
    patient: (patient: IPatient) => void
}

type PatientDetailsResult =
    | { type: "patient"; patient: IPatient }
    | { type: "appointments"; appointments: IAppointment[] }
    | { type: "message"; message: string }

export default function SearchForm({ visible, patient }: ISearchForm) {
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

    function handleResult(result: PatientDetailsResult) {
        switch (result.type) {
            case "patient":
                patient(result.patient)
                setFeedbackMessage(null)
                break
            
            case "message":
                setFeedbackMessage(result.message)
                break
            
            // Não deveria ocorrer, mas garante que o tipo está coberto
            default:
                setFeedbackMessage("Erro inesperado")
                break
        }
    }

    return (
        <div className={`${visible && styles.visible} ${styles.searchForm}`}>
            <PatientDetailsForm onResult={handleResult} callType="patient" />
            {feedbackMessage && <FeedbackMessage className={styles.message} message={feedbackMessage} icon={<UserX />} />}
        </div>
    )
}