import { useState } from "react"
import styles from "./styles.module.scss"
import { UserX } from "lucide-react"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import PatientCard from "@/components/cards/PatientCard"
import SectionWrapper from "@/components/layout/SectionWrapper"
import BackBtn from "@/components/ui/BackBtn"
import PatientDetailsForm from "@/components/forms/PatientDetailsForm"

type PatientDetailsResult =
    | { type: "patient"; patient: IPatient }
    | { type: "appointments"; appointments: IAppointment[] }
    | { type: "message"; message: string }

export default function Search() {
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
    const [patient, setPatient] = useState<IPatient | null>(null)

    function handleResult(result: PatientDetailsResult) {
        switch (result.type) {
            case "patient":
                setPatient(result.patient)
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
        <SectionWrapper title="Pesquisar Paciente">
            <>
                {!patient ? (
                    <div className={styles.search}>
                        <PatientDetailsForm onResult={handleResult} callType="patient" />
                        {feedbackMessage && <FeedbackMessage className={styles.message} message={feedbackMessage} icon={<UserX />} />}
                    </div>
                ) : (
                    <>
                        <PatientCard patient={patient} />
                        <BackBtn onClick={() => setPatient(null)} />
                    </>
                )}
            </>
        </SectionWrapper>
    )
}