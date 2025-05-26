/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import styles from "./styles.module.scss"
import { IMaskInput } from "react-imask"
import Label from "@/components/shared/Label"
import Spinner from "@/components/shared/Spinner"
import FeedbackMessage from "@/components/shared/FeedbackMessage"
import Button from "@/components/shared/Button"
import { Search, SearchX } from "lucide-react"

interface ISearchField {
    appointmentsFound: (appointments: IAppointment[]) => void
    visible: boolean
}

export default function SearchField({ appointmentsFound, visible }: ISearchField) {
    const [cpfField, setCpfField] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)

    async function handleSearchAppointmentsByCPF(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setMessage(null)
        setIsLoading(true)
        appointmentsFound([])

        try {
            const response = await fetch(`/api/appointment/cpf/${cpfField}`)
            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao buscar as consultas")

            if (data.length === 0) setMessage("Nenhuma consulta encontrada")

            appointmentsFound(data)
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSearchAppointmentsByCPF} className={`${visible && styles.visible} ${styles.searchField}`}>
            <Label text="Digite o CPF do Paciente:" />
            <IMaskInput
                className="imask-input"
                mask="000.000.000-00"
                value={cpfField}
                onAccept={(value) => setCpfField(value)}
                overwrite
                minLength={14}
                required
            />
            <Button type="submit" icon={<Search />} text="Buscar" disabled={isLoading} />
            {isLoading && <div className={styles.spinner}><Spinner /></div>}
            {message && <div className={styles.message}><FeedbackMessage icon={<SearchX />} message={message} /></div>}
        </form>
    )
}