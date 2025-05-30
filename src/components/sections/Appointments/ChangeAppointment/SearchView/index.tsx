/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMaskInput } from "react-imask"
import styles from "./styles.module.scss"
import { useState } from "react"
import { FileSearch, SearchX } from "lucide-react"
import Button from "@/components/ui/Button"
import Label from "@/components/ui/Label"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import Spinner from "@/components/ui/Spinner"

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
        <form onSubmit={fetchAppointments} className={`${visible && styles.visible} ${styles.form}`}>
            <Label text="Digite o CPF do Paciente"/>
            <IMaskInput
                className="imask-input"
                mask="000.000.000-00"
                value={cpf}
                onAccept={(value) => setCpf(value)}
                overwrite
                minLength={14}
                required
            />
            {!isLoading ? <Button text="Buscar Consultas" icon={<FileSearch />} type="submit" /> : <div className={styles.spinner}><Spinner /></div>}
            {error && <div className={styles.message}><FeedbackMessage message={error} icon={<SearchX />}/></div>}
        </form>
    )
}