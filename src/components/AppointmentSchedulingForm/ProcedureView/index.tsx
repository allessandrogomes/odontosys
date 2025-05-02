import { useEffect, useState } from "react"
import styles from "./styles.module.scss"

interface IProcedure {
    id: number | null
    procedure: string | null
    durationMinutes: number | null
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
        } else {
            onSelectProcedure({ 
                id: null,
                procedure: null,
                durationMinutes: null
             })
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
        <div className={styles.box}>
            <label>Escolha o Procedimento</label>
            <select onChange={handleChange}>
                <option value="">Selecione</option>
                {procedures.map(item => <option key={item.id} value={item.id!}>{item.procedure}</option>)}
            </select>
        </div>
    )
}