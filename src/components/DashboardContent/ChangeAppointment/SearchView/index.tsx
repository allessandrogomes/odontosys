/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMaskInput } from "react-imask"
import styles from "./styles.module.scss"
import { useState } from "react"
import { MdContentPasteSearch } from "react-icons/md"
import { Loader } from "lucide-react"

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
            <label>Digite o CPF do Paciente</label>
            <IMaskInput
                mask="000.000.000-00"
                value={cpf}
                onAccept={(value) => setCpf(value)}
                overwrite
                minLength={14}
                required
            />
            {!isLoading ? <button type="submit"><MdContentPasteSearch className={styles.icon} /> Buscar Consultas</button> : <Loader className={styles.spinner} />}
            {error && <p className={styles.error}>{error}</p>}
        </form>
    )
}