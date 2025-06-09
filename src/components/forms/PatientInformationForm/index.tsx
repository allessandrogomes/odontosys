import { IMaskInput } from "react-imask"
import styles from "./styles.module.scss"
import Spinner from "@/components/ui/Spinner"
import Button from "@/components/ui/Button"

interface IFormData {
    name: string,
    email: string,
    phone: string,
    cpf: string,
    birthDate: string
}

interface IPatientInformationForm {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onMaskInputChange: (name: keyof IFormData, value: string) => void
    formData: IFormData
    isLoading: boolean
    disabled?: boolean
    submitBtnText: string
    submitBtnIcon: React.ReactElement
}

export default function PatientInformationForm({ onSubmit, onChange, onMaskInputChange, formData, isLoading, disabled = false, submitBtnText, submitBtnIcon }: IPatientInformationForm) {
    return (
        <form onSubmit={onSubmit} className={styles.patientInformationForm}>
            <div>
                <label>Nome Completo</label>
                <IMaskInput
                    mask={/^[A-Za-zÀ-ÿ\s]*$/}
                    value={formData.name}
                    onAccept={(value) => onMaskInputChange("name", value)}
                    overwrite
                    required
                />
            </div>
            <div>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={onChange} required />
            </div>
            <div>
                <label>Telefone</label>
                <IMaskInput
                    mask="(00) 00000-0000"
                    value={formData.phone}
                    onAccept={(value) => onMaskInputChange("phone", value)}
                    overwrite
                    minLength={15}
                    required
                />
            </div>
            <div>
                <label>CPF</label>
                <IMaskInput
                    mask="000.000.000-00"
                    value={formData.cpf}
                    onAccept={(value) => onMaskInputChange("cpf", value)}
                    overwrite
                    minLength={14}
                    required
                />
            </div>
            <div>
                <label>Data de Nascimento</label>
                <input type="date" name="birthDate" value={formData.birthDate ? formData.birthDate.substring(0, 10) : ""} onChange={onChange} />
            </div>

            {isLoading ? (
                <div className={styles.spinner}><Spinner /></div>
            ) : (
                <Button
                    type="submit"
                    iconStart={submitBtnIcon}
                    text={submitBtnText}
                    disabled={disabled}
                    className={styles.submitBtn}
                />
            )}
        </form>
    )
}