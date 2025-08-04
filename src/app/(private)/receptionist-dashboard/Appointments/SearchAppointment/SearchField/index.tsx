/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import styles from "./styles.module.scss"
import Spinner from "@/components/ui/Spinner"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import { getAppointmentsByCPF } from "@/services/appointments/getAppointmentsByCPF"
import PatientCPFSearchForm from "@/components/forms/PatientSearchByCPF"
import { Info, SearchX } from "lucide-react"

interface ISearchField {
    appointmentsFound: (appointments: IAppointment[]) => void
    visible: boolean
}

const INITIAL_MESSAGE = "Digite um CPF e clique em Buscar para encontrar consultas..."

export default function SearchField({ appointmentsFound, visible }: ISearchField) {
    const [cpfField, setCpfField] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>(INITIAL_MESSAGE)
    const [lastSearchCpf, setLastSearchCpf] = useState<string | null>(null)

    async function handleSearchAppointmentsByCPF(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // Caso o mesmo CPF seja enviado mais de uma vez, evita fetch desnecessário
        if (lastSearchCpf === cpfField) {
            return
        } else {
            setLastSearchCpf(cpfField)
        }

        setMessage(null)
        setIsLoading(true)
        appointmentsFound([])

        try {
            const data = await getAppointmentsByCPF(cpfField)

            if (data.length === 0) setMessage("Nenhuma consulta encontrada")

            appointmentsFound(data)
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div 
            className={`${styles.searchField} ${visible && styles.visible}`}
            aria-live="polite"
            aria-atomic="true"
        >
            <PatientCPFSearchForm
                cpf={cpfField} 
                onCpfChange={setCpfField}
                isLoading={isLoading}
                onSubmit={handleSearchAppointmentsByCPF}
                flexRow
            />
            {isLoading && <Spinner className={styles.spinner}/>}
            {message && <FeedbackMessage className={styles.message} icon={message === INITIAL_MESSAGE ? <Info data-testid="info-icon"/> : <SearchX data-testid="error-icon"/>} message={message} />}
        </div>
    )
}