/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMaskInput } from "react-imask"
import styles from "./styles.module.scss"
import { useState } from "react"
import { Loader, Search, UserX } from "lucide-react"
import Button from "@/components/ui/Button"
import Label from "@/components/ui/Label"
import FeedbackMessage from "@/components/ui/FeedbackMessage"

interface ISearchForm {
    visible: boolean
    patient: (patient: IPatient) => void
}

export default function SearchForm({ visible, patient }: ISearchForm) {
    const [cpf, setCpf] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(null)

    async function handleSearchPatient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            const response = await fetch(`/api/patient/cpf/${cpf}`)
            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro interno no servidor")
            
            if (!data) return setMessage("Nenhum paciente encontrado")

            patient(data)
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    } 

    return (
        <form onSubmit={handleSearchPatient} className={`${visible && styles.visible} ${styles.searchForm}`}>
            <div>
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
            </div>
            {isLoading ? (
                <Loader className={styles.spinner}/>
            ) : (
                <Button type="submit" icon={<Search />} text="Buscar"/>
            )}
            {message && <div className={styles.message}><FeedbackMessage message={message} icon={<UserX />}/></div>}
        </form>
    )
}