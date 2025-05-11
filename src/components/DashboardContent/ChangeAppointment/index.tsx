/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMaskInput } from "react-imask"
import styles from "./styles.module.scss"
import { MdContentPasteSearch } from "react-icons/md"
import { useState } from "react"
import { Loader } from "lucide-react"

export default function ChangeAppointment() {
    const [cpf, setCpf] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [appointments, setAppointments] = useState<IAppointment[]>([])
    const [error, setError] = useState<string | undefined>(undefined)

    async function fetchAppointments(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(undefined)
        setAppointments([])
        setIsLoading(true)

        try {
            const response = await fetch(`/api/appointment/cpf/${cpf}`, {
                method: "GET"
            })
            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao buscar as consultas")

            if (data.length === 0) throw new Error("Nenhuma consulta encontrada")

            setAppointments(data)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={fetchAppointments} className={styles.form}>
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
            {error && <p>{error}</p>}
            {appointments && appointments.map(item => <p key={item.id}>{item.id}</p>)}
        </form>
    )
}