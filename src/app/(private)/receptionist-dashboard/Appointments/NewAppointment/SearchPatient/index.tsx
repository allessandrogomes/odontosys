import PatientSearchByCPF from "@/components/forms/PatientSearchByCPF"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import { useState } from "react"
import { useAppointmentContext } from "@/contexts/AppointmentContext"
import { Info } from "lucide-react"

export default function SearchPatient() {
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
    const { state, dispatch } = useAppointmentContext()

    function handleResult(result: { patient?: IPatient; message?: string }) {
        // Se o resultado contiver um paciente, atualiza o estado do contexto
        if (result.patient) {
            dispatch({
                type: "SET_PATIENT",
                payload: {
                    id: result.patient.id,
                    name: result.patient.name
                }
            })
            setFeedbackMessage(null)

            // Avança para a próxima etapa
            dispatch({
                type: "SET_STEP",
                payload: state.step + 1
            })
        } else (
            setFeedbackMessage(result.message || "Erro desconhecido ao buscar paciente")
        )
    }

    return (
        <div>
            <PatientSearchByCPF
                onResult={handleResult}
            />
            {feedbackMessage && <FeedbackMessage icon={<Info />} message={feedbackMessage} />}
        </div>
    )
}