/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import styles from "./styles.module.scss"
import { IMaskInput } from "react-imask"
import { formatDateISO } from "@/utils/formatDateISO"
import { formatPhone } from "@/utils/formatPhone"
import { formatCPF } from "@/utils/formatCPF"
import { SearchIcon, UserX } from "lucide-react"
import Button from "@/components/shared/Button"
import Label from "@/components/shared/Label"
import FeedbackMessage from "@/components/shared/FeedbackMessage"
import Spinner from "@/components/shared/Spinner"

export default function Search() {
    const [cpf, setCpf] = useState<string>("")
    const [patientInfo, setPatientInfo] = useState<IPatient | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)

    async function handleSearchPatient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setMessage(null)
        setPatientInfo(null)
        setIsLoading(true)

        try {
            const response = await fetch(`/api/patient/cpf/${cpf}`)
            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao buscar os dados")

            // Caso não encontre nenhum Paciente com esse CPF 
            if (!data) return setMessage("Nenhum Paciente encontrado")

            setPatientInfo(data)
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.search}>
            <form onSubmit={handleSearchPatient}>
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
                <Button type="submit" icon={<SearchIcon />} text="Buscar" disabled={isLoading}/>
            </form>

            {isLoading ? (
                <div className={styles.spinner}><Spinner /></div>
            ) : (
                <>
                    {message && <div className={styles.message}><FeedbackMessage message={message} icon={<UserX />}/></div>}
                    {patientInfo && (
                        <div className={styles.info}>
                            <p>Nome: <span>{patientInfo.name}</span></p>
                            <p>CPF: <span>{formatCPF(patientInfo.cpf)}</span></p>
                            <p>Email: <span>{patientInfo.email}</span></p>
                            <p>Telefone: <span>{formatPhone(patientInfo.phone)}</span></p>
                            <p>Data de Nascimento: <span>{formatDateISO(patientInfo.birthDate)}</span></p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}