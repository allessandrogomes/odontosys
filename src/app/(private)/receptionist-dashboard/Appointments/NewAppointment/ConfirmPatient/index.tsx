import { useAppointmentContext } from "@/contexts/AppointmentContext"
import { ArrowLeft, ArrowRight } from "lucide-react"
import styles from "./styles.module.scss"
import Button from "@/components/ui/Button"

export default function ConfirmPatient() {
    const { state, dispatch } = useAppointmentContext()

    function handleBack() {
        // Volta para a etapa de busca de paciente
        dispatch({
            type: "SET_STEP",
            payload: 1
        })

        // Reseta o paciente selecionado
        dispatch({
            type: "SET_PATIENT",
            payload: {
                id: null,
                name: ""
            }
        })
    }

    function handleNext() {
        // Avança para a próxima etapa
        dispatch({
            type: "SET_STEP",
            payload: 3
        })
    }

    return (
        <div className={styles.container}>
            <p>Paciente: <strong>{state.patientName}</strong></p>
            <div className={styles.boxBtns}>
                <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack} />
                <Button text="Próximo" iconEnd={<ArrowRight />} onClick={handleNext} />
            </div>
        </div>
    )
}