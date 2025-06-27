import React, { useState } from "react"
import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight, OctagonX } from "lucide-react"
import Spinner from "@/components/ui/Spinner"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import useSWR from "swr"
import fetcher from "@/services/fetcher"

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
    const { data: procedures, error, isLoading } = useSWR("/api/procedure", fetcher, {
        revalidateOnFocus: false
    })
    const [selectedProcedure, setSelectedProcedure] = useState<IProcedure | null>(null)

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectId = Number(e.target.value)
        const procedure = procedures.find((p: IProcedure) => p.id === selectId) || null
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

    return (
        <div className={`${styles.box} ${active && styles.active}`}>
            {isLoading ? (
                <div><Spinner /></div>
            ) : error ? (
                <FeedbackMessage message={error} icon={<OctagonX />}/>
            ) : (
                <>
                    <Label htmlFor="procedure-select" text="Escolha o Procedimento" />
                    <select id="procedure-select" onChange={handleChange} value={selectedProcedure?.id || ""}>
                        <option disabled value="">Selecione um procedimento</option>
                        {procedures.map((item: IProcedure) => <option key={item.id} value={item.id!}>{item.procedure}</option>)}
                    </select>
                </>
            )}
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