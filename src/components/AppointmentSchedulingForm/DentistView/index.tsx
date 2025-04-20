import { useEffect, useState } from "react"

interface IDentistView {
    procedure: string | null,
    dentistId: (id: number) => void
}

export default function DentistView({ procedure, dentistId }: IDentistView) {
    const [dentists, setDentists] = useState<IDentist[]>([])
    const [selectedDentist, setSelectedDentist] = useState<IDentist | null>(null)

    function handleSelectDentist(dentist: IDentist) {
        setSelectedDentist(dentist)
        dentistId(dentist.id)
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
                <div>
                    <h4>Selecione o Dentista</h4>
                    {dentists && dentists.map(dentist => (
                        <div key={dentist.id}>
                            <p>{dentist.name}</p>
                            <button onClick={() => handleSelectDentist(dentist)}>Selecionar</button>
                        </div>
                    ))}
                </div>
            )}

            {selectedDentist && (
                <>
                    <p>Dentista selecionado: {selectedDentist.name}</p>
                    <button onClick={() => setSelectedDentist(null)}>Trocar dentista</button>
                </>
            )}
        </>
    )
}