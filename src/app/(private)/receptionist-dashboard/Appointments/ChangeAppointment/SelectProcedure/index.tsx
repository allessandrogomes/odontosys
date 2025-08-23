import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight, OctagonX } from "lucide-react"
import Spinner from "@/components/ui/Spinner"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import useSWR from "swr"
import fetcher from "@/services/fetcher"
import { useChangeAppointmentContext } from "@/contexts/ChangeAppointmentContext"

interface IProcedure {
    id: number | null
    procedure: string | null
    durationMinutes: number | null
}

export default function SelectProcedure() {
    // Busca os procedimentos disponíveis
    const { data: procedures, error, isLoading } = useSWR<IProcedure[] | null>("/api/procedure", fetcher, { revalidateOnFocus: false })
    const { state, dispatch } = useChangeAppointmentContext()

    // Função para lidar com a mudança de seleção do procedimento
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedName = e.target.value

        // Armazena em 'selectedProcedure' o procedimento selecionado pelo usuário
        if (procedures && procedures.length > 0) {
            const selectedProcedure = procedures.find(
                (p: IProcedure) => p.procedure === selectedName
            )

            // Caso o procedimento selecionado exista, atualiza o state do contexto alterando apenas o 'procedure' e 'durationMinutes'
            // Se 'selectedAppointment' não existir, retorna o valor atual da consulta (não altera)
            if (selectedProcedure?.procedure && selectedProcedure.durationMinutes) {
                dispatch({
                    type: "SET_SELECTED_APPOINTMENT",
                    payload: state.selectedAppointment
                        ? {
                            ...state.selectedAppointment,
                            procedure: selectedProcedure?.procedure,
                            durationMinutes: selectedProcedure?.durationMinutes
                        }
                        : null
                })
            }
        }
    }

    // Função para voltar para a etapa anterior
    function handleBack() {
        dispatch({ type: "SET_STEP", payload: 2 })
    }

    // Função para avançar para a próxima etapa
    function handleNext() {
        dispatch({ type: "SET_STEP", payload: 4 })
    }

    return (
        <div className={styles.box}>
            {isLoading ? (
                <div><Spinner /></div>
            ) : error ? (
                <FeedbackMessage message={error} icon={<OctagonX />} />
            ) : (
                <>
                    <Label htmlFor="procedure-select" text="Escolha o Procedimento" />
                    <select id="procedure-select" onChange={handleChange} value={state.selectedAppointment?.procedure || ""}>
                        <option disabled value="">Selecione um procedimento</option>
                        {procedures && procedures.map((item: IProcedure) => <option key={item.id} value={item.procedure!}>{item.procedure}</option>)}
                    </select>
                </>
            )}
            {/* Botões de navegação */}
            <div className={styles.boxBtns}>
                <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack} />
                <Button text="Próximo" iconEnd={<ArrowRight />} onClick={handleNext} disabled={!state.selectedAppointment?.procedure} />
            </div>
        </div>
    )
}