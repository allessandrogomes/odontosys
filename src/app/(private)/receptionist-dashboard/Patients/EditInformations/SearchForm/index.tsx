/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./styles.module.scss"
import { useState } from "react"
import { UserX } from "lucide-react"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import PatientCPFSearchForm from "@/components/forms/PatientDetailsForm"
import Spinner from "@/components/ui/Spinner"

interface ISearchForm {
    visible: boolean
    patient: (patient: IPatient) => void
}

export default function SearchForm({ visible, patient }: ISearchForm) {
    const [cpf, setCpf] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)

    async function handleSearchPatient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            const response = await fetch(`/api/patient/cpf/${cpf}`)
            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro interno no servidor")

            if (!data) return setMessage("Nenhum paciente encontrado")

            patient(data)
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`${visible && styles.visible} ${styles.searchForm}`}>
            {/* <PatientCPFSearchForm cpf={cpf} isLoading={isLoading} onCpfChange={setCpf} onSubmit={handleSearchPatient} /> */}
            {message && <FeedbackMessage className={styles.message} message={message} icon={<UserX />} />}
            {isLoading && <Spinner className={styles.spinner}/>}
        </div>
    )
}