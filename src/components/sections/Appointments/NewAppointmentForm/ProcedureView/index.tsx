import React, { useEffect, useState } from "react"
import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface IProcedure {
    id: number | null
    procedure: string | null
    durationMinutes: number | null
}

interface IProcedureViewProps {
    onSelectProcedure: (procedure: IProcedure) => void
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onBack: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    active: boolean
}

export default function ProcedureView({ onSelectProcedure, onNext, onBack, active }: IProcedureViewProps) {
    const [procedures, setProcedures] = useState<IProcedure[]>([])
    const [selectedProcedure, setSelectedProcedure] = useState<IProcedure | null>(null)

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectId = Number(e.target.value)
        const procedure = procedures.find(p => p.id === selectId) || null
        if (procedure) {
            onSelectProcedure(procedure)
            setSelectedProcedure(procedure)
        } else {
            onSelectProcedure({
                id: null,
                procedure: null,
                durationMinutes: null
            })
            setSelectedProcedure(null)
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
        <div className={`${styles.box} ${active && styles.active}`}>
            <Label text="Escolha o Procedimento"/>
            <select onChange={handleChange} value={selectedProcedure ? selectedProcedure.id! : ""}>
                <option disabled value="">Selecione</option>
                {procedures.map(item => <option key={item.id} value={item.id!}>{item.procedure}</option>)}
            </select>
            <div className={styles.boxBtns}>
                <Button text="Voltar" iconStart={<ArrowLeft />} onClick={e => onBack(e)} />
                <Button
                    disabled={!selectedProcedure}
                    text="Próximo"
                    iconEnd={<ArrowRight />}
                    onClick={e => onNext(e)}
                />
            </div>
        </div>
    )
}