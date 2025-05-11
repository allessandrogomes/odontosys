/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdContentPasteSearch } from "react-icons/md"
import { IMaskInput } from "react-imask"
import { useState } from "react"
import { Loader } from "lucide-react"
import styles from "./styles.module.scss"
import { formatDateISO } from "@/utils/formatDateISO"
import { formatHour } from "@/utils/formatHour"
import { FaArrowLeft } from "react-icons/fa"

interface ISearchAndSelectAppointmentView {
    onSelectAppointment: (appointment: IAppointment) => void
}

export default function SearchAndSelectAppointmentView({ onSelectAppointment }: ISearchAndSelectAppointmentView) {
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

    function handleSelectAppointment(app: IAppointment) {
        onSelectAppointment(app)
    }

    return (
        <>
            {appointments.length === 0 ? (
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
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            ) : (
                <div className={styles.selectAppointment}>
                    <button onClick={() => setAppointments([])}><FaArrowLeft />Voltar</button>
                    <h1>Selecione a Consulta</h1>
                    <p className={styles.patientName}>Paciente: <span>{appointments[0].patient.name}</span></p>
                    {appointments.map(app => (
                        <div onClick={() => handleSelectAppointment(app)} key={app.id}>
                            <p>{app.procedure}</p>
                            <span></span>
                            <p>Dr. {app.dentist.name}</p>
                            <span></span>
                            <p>{formatDateISO(app.scheduledAt)}</p>
                            <span></span>
                            <p>{formatHour(app.scheduledAt)} - {formatHour(app.endsAt)}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}