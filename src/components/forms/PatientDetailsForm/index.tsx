import { IMaskInput } from "react-imask"
import { Search } from "lucide-react"
import Label from "../../ui/Label"
import Button from "../../ui/Button"
import styles from "./styles.module.scss"
import { useState } from "react"
import Spinner from "@/components/ui/Spinner"

// Formulário reutilizável para buscar pacientes ou agendamentos por CPF
// O tipo de chamada é determinado pelo parâmetro `callType`
// O resultado é retornado através da função `onResult`
// retornando com `onResult` um paciente ou uma lista de agendamentos ou uma mensagem de feedback
// `flexRow` permite que o formulário seja exibido em uma linha flexível, útil para layouts responsivos

// Tipos de resultado possíveis da busca
type PatientResult = 
    | { type: "patient"; patient: IPatient }
    | { type: "appointments"; appointments: IAppointment[] }
    | { type: "message"; message: string }

interface IPatientDetailsForm {
    callType: "patient" | "appointment"
    onResult:(result: PatientResult) => void
    flexRow?: boolean
}

export default function PatientDetailsForm({
    callType,
    onResult,
    flexRow = false
}: IPatientDetailsForm) {
    const [cpf, setCpf] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Função para lidar com o envio do formulário
    // Faz uma requisição para buscar o paciente ou agendamentos pelo CPF
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`/api/${callType}/cpf/${cpf}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao buscar dados")
            }

            if (!data || (Array.isArray(data) && data.length === 0)) {
                onResult({
                    type: "message",
                    message: 
                        callType === "patient"
                            ? "Nenhum paciente encontrado"
                            : "Nenhum agendamento encontrado"
                })
                return
            }

            if (callType === "patient") {
                onResult({ type: "patient", patient: data as IPatient })
            } else {
                onResult({ type: "appointments", appointments: data as IAppointment[] })
            }
             
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro desconhecido"
            onResult({ type: "message", message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`${styles.form} ${flexRow && styles.flexRow}`}>
            <Label text="CPF do Paciente:" htmlFor="cpf-input" />
            <IMaskInput
                aria-label="CPF"
                className="imask-input"
                mask="000.000.000-00"
                value={cpf}
                onAccept={(value: string) => setCpf(value)}
                overwrite
                minLength={14}
                required
                id="cpf-input"
            />
            {isLoading ? <Spinner /> : <Button type="submit" iconStart={<Search />} text="Buscar" disabled={isLoading} />}
        </form>
    )
}