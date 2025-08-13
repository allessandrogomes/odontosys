import FeedbackMessage from "@/components/ui/FeedbackMessage"
import { useState } from "react"
import { useAppointmentContext } from "@/contexts/AppointmentContext"
import { Info } from "lucide-react"
import PatientDetailsForm from "@/components/forms/PatientDetailsForm"
import styles from "./styles.module.scss"

type PatientResult =
    | { type: "patient"; patient: IPatient }
    | { type: "appointments"; appointments: IAppointment[] }
    | { type: "message"; message: string }

export default function SearchPatient() {
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
    const { dispatch } = useAppointmentContext()

    // Função para lidar com o resultado da busca do paciente
    // Atualiza o estado do contexto com os dados do paciente ou exibe uma mensagem de feedback
    function handleResult(result: PatientResult) {
        switch (result.type) {
            case "patient":
                dispatch({ type: "SET_PATIENT", payload: { id: result.patient.id, name: result.patient.name } })
                setFeedbackMessage(null)

                dispatch({ type: "SET_STEP", payload: 2 })
                break
            
            case "message":
                setFeedbackMessage(result.message || "Erro ao buscar paciente")
                break

            // Não deveria ocorrer, mas garante que o tipo está coberto
            default:
                setFeedbackMessage("Erro inesperado")
                break
        }
    }

    return (
        <div className={styles.container}>
            <PatientDetailsForm onResult={handleResult} callType="patient" />
            {feedbackMessage && <FeedbackMessage className={styles.feedbackMsg} icon={<Info />} message={feedbackMessage} />}
        </div>
    )
}