import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight, OctagonX } from "lucide-react"
import Spinner from "@/components/ui/Spinner"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import useSWR from "swr"
import fetcher from "@/services/fetcher"
import { useAppointmentContext } from "@/contexts/AppointmentContext"

interface IProcedure {
    id: number | null
    procedure: string | null
    durationMinutes: number | null
}

export default function SelectProcedure() {
    // Busca os procedimentos disponíveis
    const { data: procedures, error, isLoading } = useSWR("/api/procedure", fetcher, { revalidateOnFocus: false })
    const { state, dispatch } = useAppointmentContext()

    // Função para lidar com a mudança de seleção do procedimento
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedName = e.target.value

        const selectedProcedure = procedures.find(
            (p: IProcedure) => p.procedure === selectedName
        )

        dispatch({
            type: "SET_PROCEDURE",
            payload: {
                procedure: selectedProcedure?.procedure ?? null,
                durationMinutes: selectedProcedure?.durationMinutes ?? null
            }
        })
    }

    // Função para voltar para a etapa anterior
    function handleBack() {
        dispatch({ type: "SET_STEP", payload: state.step - 1 })
    }

    // Função para avançar para a próxima etapa
    function handleNext() {
        dispatch({ type: "SET_STEP", payload: state.step + 1 })
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
                    <select id="procedure-select" onChange={handleChange} value={state.procedure || ""}>
                        <option disabled value="">Selecione um procedimento</option>
                        {procedures.map((item: IProcedure) => <option key={item.id} value={item.procedure!}>{item.procedure}</option>)}
                    </select>
                </>
            )}
            {/* Botões de navegação */}
            <div className={styles.boxBtns}>
                <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack} />
                <Button text="Próximo" iconEnd={<ArrowRight />} onClick={handleNext} disabled={!state.procedure} />
            </div>
        </div>
    )
}