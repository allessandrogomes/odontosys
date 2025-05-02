import { useState } from "react"
import styles from "./styles.module.scss"

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

            const patient = data.find((item: IPatient) => item.cpf === cpf)
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
            {!patientSelected && (
                <>
                    <label>CPF do Paciente</label>
                    <input onChange={e => setCpf(e.target.value)} value={cpf} />
                    <button style={cpf.length === 0 ? { backgroundColor: "gray", cursor: "initial" } : {}} disabled={!cpf} onClick={handleSearchPatient}>Buscar</button>
                </>
            )}
            {notFound && <p>Nenhum paciente encontrado.</p>}
            {patientFinded && !patientSelected && (
                <div className={styles.ask}>
                    <p>O Paciente se chama <span>{patientFinded.name}</span>?</p>
                    <div>
                        <button onClick={correctPatient}>Sim</button>
                        <button onClick={wrongPatient}>Não</button>
                    </div>
                </div>
            )}
            {patientSelected && (
                <>
                    <p>Paciente selecionado: <span>{patientSelected}</span></p>
                    <button onClick={e => wrongPatient(e)}>Alterar</button>
                </>
            )}
        </div>
    )
}