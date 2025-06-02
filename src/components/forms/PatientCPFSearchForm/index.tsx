import { IMaskInput } from "react-imask"
import { Search } from "lucide-react"
import Label from "../../ui/Label"
import Button from "../../ui/Button"
import styles from "./styles.module.scss"

interface IPatientCPFSearchForm {
    cpf: string
    isLoading: boolean
    flexRow?: boolean
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onCpfChange: (value: string) => void
}

export default function PatientCPFSearchForm({ cpf, isLoading, flexRow = false, onSubmit, onCpfChange }: IPatientCPFSearchForm) {
    return (
        <form onSubmit={onSubmit} className={`${styles.form} ${flexRow && styles.flexRow}`}>
            <Label text="CPF do Paciente:" />
            <IMaskInput
                className="imask-input"
                mask="000.000.000-00"
                value={cpf}
                onAccept={(value) => onCpfChange(value)}
                overwrite
                minLength={14}
                required
            />
            <Button type="submit" icon={<Search />} text="Buscar" disabled={isLoading} />
        </form>
    )
}