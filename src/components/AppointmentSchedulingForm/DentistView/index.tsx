import { useEffect, useState } from "react"
import styles from "./styles.module.scss"

interface IDentistView {
    procedure: string | null,
    dentistId: (id: number | null) => void
}

export default function DentistView({ procedure, dentistId }: IDentistView) {
    const [dentists, setDentists] = useState<IDentist[]>([])
    const [selectedDentist, setSelectedDentist] = useState<IDentist | null>(null)

    function handleSelectDentist(dentist: IDentist) {
        setSelectedDentist(dentist)
        dentistId(dentist.id)
    }

    function handleChangeDentist() {
        setSelectedDentist(null)
        dentistId(null)
    }

    useEffect(() => {
        async function fetchDentists() {
            try {
                const response = await fetch("/api/dentist")
                const data = await response.json()
                const filteredDentists = data.filter((dentist: IDentist) => dentist.specialty.includes(procedure!))
                setDentists(filteredDentists)
            } catch (error) {
                alert(JSON.stringify(error))
            }
        }

        if (procedure) {
            fetchDentists()
        }
    }, [procedure])
    return (
        <>
            {!selectedDentist && (
                <div className={styles.box}>
                    <h4>Selecione o Dentista</h4>
                    <div className={styles.containerDentists}>
                        {dentists && dentists.map(dentist => (
                            <div className={styles.dentist} onClick={() => handleSelectDentist(dentist)} key={dentist.id}>
                                <p>Dr. {dentist.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedDentist && (
                <>
                    <p>Dentista selecionado: <span className={styles.span}>Dr. {selectedDentist.name}</span></p>
                    <button onClick={handleChangeDentist}>Alterar Dentista</button>
                </>
            )}
        </>
    )
}