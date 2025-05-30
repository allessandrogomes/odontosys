import { useState } from "react"
import styles from "./styles.module.scss"
import { IMaskInput } from "react-imask"
import Label from "@/components/ui/Label"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import { UserX } from "lucide-react"

interface IPatientCPFView {
    onSelectPatientId: (id: number) => void
    patientName: (patientName: string | null) => void
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    active: boolean
}

export default function PatientCPFView({ onSelectPatientId, onNext, active, patientName }: IPatientCPFView) {
    const [cpf, setCpf] = useState<string>("")
    const [patientSelected, setPatientSelected] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)


    async function handleSearchPatient() {
        try {
            const response = await fetch("/api/patient", {
                method: "GET"
            })

            if (!response.ok) throw new Error("Erro ao buscar paciente")

            const data = await response.json()

            const numericCPF = cpf.replace(/\D/g, "")
            const patient = data.find((item: IPatient) => item.cpf.replace(/\D/g, "") === numericCPF)
            if (patient) {
                setPatientSelected(patient.name)
                onSelectPatientId(patient.id)
                patientName(patient.name)
                setNotFound(false)
            } else {
                setNotFound(true)
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div className={`${styles.box} ${active && styles.active}`}>

            {/* Campo para buscar paciente pelo CPF */}
            {!patientSelected && (
                <div className={styles.cpfField}>
                    <Label text="CPF do Paciente" />
                    <IMaskInput
                        className="imask-input"
                        mask="000.000.000-00"
                        value={cpf}
                        onAccept={(value) => setCpf(value)}
                        overwrite
                        minLength={14}
                        required
                    />
                    {notFound && <div className={styles.message}><FeedbackMessage message="Nenhum paciente encontrado" icon={<UserX />} /></div>}
                    <div className={styles.btns}>
                        <button className={`${styles.nextBtn} ${cpf.length === 14 ? styles.active : ""}`} disabled={!(cpf.length === 14)} onClick={handleSearchPatient}>Próximo</button>
                    </div>
                </div>
            )}

            {/* Mostra Paciente selecionado */}
            {patientSelected && (
                <div className={styles.selectedView}>
                    <p>Paciente selecionado: <br /><span>{patientSelected}</span></p>
                    <div className={styles.btns}>
                        <button className={styles.backBtn} onClick={() => setPatientSelected(null)}>Voltar</button>
                        <button className={styles.nextBtn} onClick={e => onNext(e)}>Próximo</button>
                    </div>
                </div>
            )}
        </div>
    )
}