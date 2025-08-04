/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./styles.module.scss"
import { useState } from "react"
import { SearchX } from "lucide-react"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import Spinner from "@/components/ui/Spinner"
import PatientCPFSearchForm from "@/components/forms/PatientSearchByCPF"

interface ISearchView {
    appointmentsFound: (appointmentsFound: IAppointment[]) => void
    visible: boolean
}

type State = {
    cpf: string
    isLoading: boolean
    error: string | null
}

export default function SearchView({ appointmentsFound, visible }: ISearchView) {
    const [state, setState] = useState<State>({
        cpf: "",
        isLoading: false,
        error: null
    })

    async function fetchAppointments(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setState(prev => ({ ...prev, error: null, isLoading: true }))

        try {
            const response = await fetch(`/api/appointment/cpf/${state.cpf}`, {
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
            setState(prev => ({ ...prev, error: error.message }))
        } finally {
            setState(prev => ({ ...prev, isLoading: false }))
        }
    }

    return (
        <div className={`${visible && styles.visible} ${styles.form}`}>
            <PatientCPFSearchForm 
                cpf={state.cpf} 
                isLoading={state.isLoading} 
                onSubmit={fetchAppointments} 
                onCpfChange={(newCpf) => setState(prev => ({ ...prev, cpf: newCpf }))}
            />
            {state.error && <FeedbackMessage className={styles.message} message={state.error} icon={<SearchX />} />}
            {state.isLoading && <Spinner className={styles.spinner} />}
        </div>
    )
}