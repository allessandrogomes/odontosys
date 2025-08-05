import { useAppointmentContext } from "@/contexts/AppointmentContext"


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
        <div>
            <p>Paciente: {state.patientName}</p>
            <button onClick={handleBack}>Voltar</button>
            <button onClick={handleNext}>Próximo</button>
        </div>
    )
}