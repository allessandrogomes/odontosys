import { useState } from "react"
import styles from "./styles.module.scss"
import { IMaskInput } from "react-imask"

interface IPatientCPFView {
    onSelectPatientId: (id: number) => void
    onChangePatient: (e: React.MouseEvent<HTMLButtonElement>) => void
}



export default function PatientCPFView({ onSelectPatientId, onChangePatient }: IPatientCPFView) {
    const [cpf, setCpf] = useState<string>("")
    const [patientFinded, setPatientFinded] = useState<IPatient | null>(null)
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
                setPatientFinded(patient)
                setNotFound(false)
            } else {
                setPatientFinded(null)
                setNotFound(true)
            }
        } catch (error) {
            alert(error)
        }
    }

    function correctPatient() {
        if (patientFinded) {
            onSelectPatientId(patientFinded.id)
            setPatientSelected(patientFinded.name)
        }
    }

    function wrongPatient(e: React.MouseEvent<HTMLButtonElement>) {
        setCpf("")
        setPatientFinded(null)
        setPatientSelected(null)
        onChangePatient(e)
    }

    return (
        <div className={styles.box}>

            {/* Campo para buscar paciente pelo CPF */}
            {!patientSelected && (
                <div className={styles.cpfField}>
                    <label>CPF do Paciente</label>
                    <IMaskInput
                        mask="000.000.000-00"
                        value={cpf}
                        onAccept={(value) => setCpf(value)}
                        overwrite
                        minLength={14}
                        required
                    />
                    <button className={cpf.length === 14 ? `${styles.active}` : ""} disabled={!cpf} onClick={handleSearchPatient}>Buscar</button>
                </div>
            )}

            {/* Mensagem caso não encontre o Paciente */}
            {notFound && <p>Nenhum paciente encontrado</p>}

            {/* Confirmação do Paciente encontrado */}
            {patientFinded && !patientSelected && (
                <div className={styles.ask}>
                    <p>O Paciente se chama <br/><span>{patientFinded.name}</span>?</p>
                    <div>
                        <button onClick={correctPatient}>Sim</button>
                        <button onClick={wrongPatient}>Não</button>
                    </div>
                </div>
            )}

            {/* Mostra Paciente selecionado */}
            {patientSelected && (
                <div className={styles.selected}>
                    <p>Paciente selecionado: <br/><span>{patientSelected}</span></p>
                    <button onClick={e => wrongPatient(e)}>Alterar</button>
                </div>
            )}
        </div>
    )
}