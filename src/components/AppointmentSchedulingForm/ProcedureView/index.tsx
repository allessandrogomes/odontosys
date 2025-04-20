import { useEffect, useState } from "react"

interface IProcedure {
    id: number,
    procedure: string,
    durationMinutes: number
}

interface IProcedureViewProps {
    onSelectProcedure: (procedure: IProcedure) => void
}

export default function ProcedureView({ onSelectProcedure }: IProcedureViewProps) {
    const [procedures, setProcedures] = useState<IProcedure[]>([])

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectId = Number(e.target.value)
        const procedure = procedures.find(p => p.id === selectId) || null
        if (procedure) {
            onSelectProcedure(procedure)
        }
    }

    useEffect(() => {
        async function fetchProcedures() {
            try {
                const response = await fetch("/api/procedure")
                const data = await response.json()
                setProcedures(data)
            } catch (error) {
                alert(JSON.stringify(error))
            }
        }

        fetchProcedures()
    }, [])

    return (
        <div>
            <h4>Escolha o Procedimento</h4>
            <select onChange={handleChange}>
                <option value="">Selecione</option>
                {procedures.map(item => <option key={item.id} value={item.id}>{item.procedure}</option>)}
            </select>
        </div>
    )
}