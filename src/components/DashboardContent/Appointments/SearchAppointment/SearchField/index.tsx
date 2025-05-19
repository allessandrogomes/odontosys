/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import styles from "./styles.module.scss"
import { IMaskInput } from "react-imask"
import { Loader } from "lucide-react"
import { MdSearchOff } from "react-icons/md"

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
            <label>Digite o CPF do Paciente:</label>
            <IMaskInput
                mask="000.000.000-00"
                value={cpfField}
                onAccept={(value) => setCpfField(value)}
                overwrite
                minLength={14}
                required
            />
            <button disabled={isLoading} type="submit" className={`${isLoading && styles.disabled}`}>Buscar</button>
            {isLoading && <div className={styles.boxSpinner}><Loader className={styles.spinner}/></div>}
            {message && <p className={styles.message}><MdSearchOff className={styles.icon} />{message}</p>}
        </form>
    )
}