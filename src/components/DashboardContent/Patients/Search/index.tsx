/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import styles from "./styles.module.scss"
import { IMaskInput } from "react-imask"
import { formatDateISO } from "@/utils/formatDateISO"
import { formatPhone } from "@/utils/formatPhone"
import { formatCPF } from "@/utils/formatCPF"
import { Loader } from "lucide-react"
import { FiSearch } from "react-icons/fi"

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
                <label>Digite o CPF do Paciente</label>
                <IMaskInput
                    mask="000.000.000-00"
                    value={cpf}
                    onAccept={(value) => setCpf(value)}
                    overwrite
                    minLength={14}
                    required
                />
                <button disabled={isLoading} type="submit" className={`${isLoading && styles.disabled}`}><FiSearch className={styles.icon}/> Buscar</button>
            </form>

            {isLoading ? (
                <Loader className={styles.spinner}/>
            ) : (
                <>
                    {message && <p className={styles.message}>{message}</p>}
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