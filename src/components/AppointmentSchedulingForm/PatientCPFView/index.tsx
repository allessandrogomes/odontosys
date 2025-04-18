import { useState } from "react"

interface IPatientCPFView {
    onSelectPatientId: (id: number) => void
}



export default function PatientCPFView({ onSelectPatientId }: IPatientCPFView) {
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

    function wrongPatient() {
        setCpf("")
        setPatientFinded(null)

    }

    return (
        <div>
            {!patientSelected && (
                <>
                    <label>CPF do Paciente</label>
                    <input onChange={e => setCpf(e.target.value)} value={cpf} />
                    <button onClick={handleSearchPatient}>Buscar Paciente</button>
                </>
            )}
            {notFound && <p>Nenhum paciente encontrado.</p>}
            {patientFinded && !patientSelected && (
                <div>
                    <p>O Paciente se chama {patientFinded.name}?</p>
                    <button onClick={correctPatient}>Sim</button>
                    <button onClick={wrongPatient}>Não</button>
                </div>
            )}
            {patientSelected && <p>Paciente selecionado: {patientSelected}</p>}
        </div>
    )
}