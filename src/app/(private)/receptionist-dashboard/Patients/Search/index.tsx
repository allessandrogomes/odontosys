/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import styles from "./styles.module.scss"
import { UserX } from "lucide-react"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import Spinner from "@/components/ui/Spinner"
import PatientCPFSearchForm from "@/components/forms/PatientSearchByCPF"
import PatientCard from "@/components/cards/PatientCard"
import SectionWrapper from "@/components/layout/SectionWrapper"
import BackBtn from "@/components/ui/BackBtn"

export default function Search() {
    const [cpf, setCpf] = useState<string>("")
    const [patientInfo, setPatientInfo] = useState<IPatient | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)

    async function handleSearchPatient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setMessage(null)
        setPatientInfo(null)
        setIsLoading(true)

        try {
            const response = await fetch(`/api/patient/cpf/${cpf}`)
            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao buscar os dados")

            // Caso não encontre nenhum Paciente com esse CPF 
            if (!data) return setMessage("Nenhum Paciente encontrado")

            setPatientInfo(data)
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SectionWrapper title="Pesquisar Paciente">
            <>
                {!patientInfo ? (
                    <div className={styles.search}>
                        <PatientCPFSearchForm cpf={cpf} isLoading={isLoading} onCpfChange={setCpf} onSubmit={handleSearchPatient} />
                        {message && <FeedbackMessage className={styles.message} message={message} icon={<UserX />} />}
                        {isLoading && <Spinner className={styles.spinner} />}
                    </div>
                ) : (
                    <>
                        <PatientCard patient={patientInfo} />
                        <BackBtn onClick={() => setPatientInfo(null)}/>
                    </>
                )}
            </>
        </SectionWrapper>
    )
}