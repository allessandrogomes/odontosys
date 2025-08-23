import BackBtn from "@/components/ui/BackBtn"
import styles from "./styles.module.scss"
import AppointmentList from "@/components/lists/AppointmentList"
import { useChangeAppointmentContext } from "@/contexts/ChangeAppointmentContext"

export default function SelectAppointment() {
    const { state, dispatch } = useChangeAppointmentContext()
    const appointments = state.appointments

    // Função responsável por lançar no contexto a consulta selecionada e avançar para a proxima tela (STEP)
    function handleSelectAppointment(appointment: IAppointment) {
        dispatch({ type: "SET_SELECTED_APPOINTMENT", payload: appointment })
        dispatch({ type: "SET_STEP", payload: 3 })
    }

    // Caso o usuário clique em "Voltar", a função remove a consulta selecionada (caso exista) e retorna para a tela anterior
    function handleBack() {
        dispatch({ type: "SET_SELECTED_APPOINTMENT", payload: null })
        dispatch({ type: "SET_STEP", payload: 1 })
    }
    return (
        <div className={styles.selectAppointment}>
            <BackBtn onClick={handleBack} />
            <h2>Selecione a Consulta</h2>
            <p>Paciente: <strong>{appointments && appointments[0].patient.name}</strong></p>
            {appointments && appointments.length > 0 ? (
                <AppointmentList appointments={appointments} selectedAppointment={appointment => handleSelectAppointment(appointment)} />
            ) : (
                <p>Nenhuma consulta a mostrar...</p>
            )}
        </div>
    )
}