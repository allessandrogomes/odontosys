/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import styles from "./styles.module.scss"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import PatientCPFSearchForm from "@/components/forms/PatientCPFSearchForm"
import Spinner from "@/components/ui/Spinner"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface IPatientCPFView {
    patient: (patient: IPatient | null) => void
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    visible: boolean
}

export default function PatientCPFView({ patient, onNext, visible }: IPatientCPFView) {
    const [cpf, setCpf] = useState<string>("")
    const [patientSelected, setPatientSelected] = useState<IPatient | null>(null)
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lastSearchCpf, setLastSearchCpf] = useState<string | null>(null)

    async function handleSearchPatient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // Bloqueia buscas consecutivas iguais
        if (lastSearchCpf === cpf) {
            return
        } else {
            setLastSearchCpf(cpf)
        }

        setFeedbackMessage(null)
        setIsLoading(true)
        setPatientSelected(null)
        patient(null)

        try {
            const response = await fetch(`/api/patient/cpf/${cpf}`)
            const patientData = await response.json()

            if (!response.ok) throw new Error(patientData.error || "Erro ao buscar Paciente")

            if (!patientData) {
                setFeedbackMessage("Nenhum Paciente encontrado")
            } else {
                setPatientSelected(patientData)
                patient(patientData)
            }
        } catch (error: any) {
            setFeedbackMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`${styles.box} ${visible && styles.visible}`} aria-live="polite" aria-atomic="true">
            {!patientSelected ? (
                // Campo para buscar paciente pelo CPF
                <div className={styles.searchView}>
                    <PatientCPFSearchForm cpf={cpf} onCpfChange={setCpf} onSubmit={handleSearchPatient} isLoading={isLoading} />
                    {feedbackMessage && <FeedbackMessage message={feedbackMessage} />}
                    {isLoading && <Spinner className={styles.spinner} />
                    }                </div>
            ) : (
                // Mostra Paciente selecionado
                <div className={styles.selectedView}>
                    <p>Paciente selecionado: <br /><span>{patientSelected.name}</span></p>
                    <div className={styles.btns}>
                        <Button
                            text="Voltar"
                            iconStart={<ArrowLeft />}
                            onClick={() => {
                                setPatientSelected(null)
                                patient(null)
                            }}
                        />
                        <Button text="Próximo" iconEnd={<ArrowRight />} onClick={e => onNext(e)}/>
                    </div>
                </div>
            )}
        </div>
    )
}