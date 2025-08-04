import { IMaskInput } from "react-imask"
import { Search } from "lucide-react"
import Label from "../../ui/Label"
import Button from "../../ui/Button"
import styles from "./styles.module.scss"
import { useState } from "react"
import Spinner from "@/components/ui/Spinner"

// Formulário reutilizável para buscar paciente por CPF, "onResult" retorna o paciente ou uma mensagem (erro ou não encontrado)

interface IPatientSearchByCPF {
    flexRow?: boolean
    onResult: (result: { patient: IPatient } | { message: string }) => void
}

export default function PatientSearchByCPF({ 
    flexRow = false,
    onResult
}: IPatientSearchByCPF) {
    const [cpf, setCpf] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`/api/patient/cpf/${cpf}`)
            const data = await response.json()

            if(!response.ok) {
                throw new Error(data.error || "Erro ao buscar paciente")
            }

            if (!data || data === null) {
                onResult({ message: "Nenhum paciente encontrado" })
            } else {
                onResult({ patient: data as IPatient })
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            onResult({ message: error.message || "Erro ao buscar paciente" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`${styles.form} ${flexRow && styles.flexRow}`}>
            <Label text="CPF do Paciente:" htmlFor="cpf-input"/>
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
            {isLoading ? <Spinner /> : <Button type="submit" iconStart={<Search />} text="Buscar" disabled={isLoading}/>}
        </form>
    )
}