/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./styles.module.scss"
import { useState } from "react"
import { SearchX } from "lucide-react"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import Spinner from "@/components/ui/Spinner"
import PatientCPFSearchForm from "@/components/forms/PatientCPFSearchForm"

interface ISearchView {
    appointmentsFound: (appointmentsFound: IAppointment[]) => void
    visible: boolean
}

export default function SearchView({ appointmentsFound, visible }: ISearchView) {
    const [cpf, setCpf] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>(undefined)

    async function fetchAppointments(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(undefined)
        setIsLoading(true)

        try {
            const response = await fetch(`/api/appointment/cpf/${cpf}`, {
                method: "GET"
            })
            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao buscar as consultas")

            if (data.length === 0) {
                appointmentsFound([])
                throw new Error("Nenhuma consulta encontrada")
            }

            appointmentsFound(data)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`${visible && styles.visible} ${styles.form}`}>
            <PatientCPFSearchForm cpf={cpf} isLoading={isLoading} onSubmit={fetchAppointments} onCpfChange={setCpf} />
            {error && <FeedbackMessage className={styles.message} message={error} icon={<SearchX />} />}
            {isLoading && <Spinner className={styles.spinner} />}
        </div>
    )
}