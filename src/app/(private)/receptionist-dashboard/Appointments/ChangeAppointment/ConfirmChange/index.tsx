import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import styles from "./styles.module.scss"
import { formatDateISO } from "@/utils/formatDateISO"
import { formatHour } from "@/utils/formatHour"
import { ArrowLeft, CalendarSync, CircleX, Signpost } from "lucide-react"
import { useState } from "react"
import Spinner from "@/components/ui/Spinner"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import { useChangeAppointmentContext } from "@/contexts/ChangeAppointmentContext"


export default function ConfirmChange() {
    const { state, dispatch } = useChangeAppointmentContext()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)


    function handleBack() {
        dispatch({ type: "SET_STEP", payload: 5 })
    }

    // Objeto que contém os dados da consulta atualizado
    // Esses dados são coletados do estado do contexto
    // Eles serão enviados para a API quando o usuário confirmar a atualização
    const updatedAppointment = state.selectedAppointment
        ? {
            dentistId: state.selectedAppointment.dentistId,
            scheduledAt: state.selectedAppointment.scheduledAt,
            endsAt: state.selectedAppointment.endsAt,
            durationMinutes: state.selectedAppointment.durationMinutes,
            procedure: state.selectedAppointment.procedure
        }
        : null


    // Função que lida com o envio dos dados do agendamento para a API
    // Ela é chamada quando o usuário clica no botão "Atualizar"
    async function handleUpdateAppointment() {
        setIsLoading(true)
        setError(null)
        setIsSuccess(false)

        // Simula um tempo mínimo de carregamento de 2 segundos
        // Isso é útil para melhorar a experiência do usuário, evitando que a tela de carregamento
        // apareça por um tempo muito curto
        const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000))

        const id = state.selectedAppointment?.id

        try {
            const fetchRequest = await fetch(`/api/appointment/id/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedAppointment)
            })

            // Aguarda a resposta da API e o tempo mínimo de carregamento
            const [response] = await Promise.all([fetchRequest, minLoadingTime])
            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro desconhecido")

            // Se a resposta for bem-sucedida, atualiza o estado de sucesso
            setIsSuccess(true)
        } catch (error) {
            setError(error instanceof Error ? error.message : "Erro desconhecido")
        } finally {
            setIsLoading(false)
        }
    }

    // Limpa os dados do agendamento e volta ao passo inicial
    // Isso é útil para reiniciar o processo de alteração do agendamento
    function handleReset() {
        dispatch({ type: "SET_SELECTED_APPOINTMENT", payload: null })
        dispatch({ type: "SET_STEP", payload: 1 })
    }

    return (
        <Card width="500px" height="300px">
            {isLoading ? (
                <div className={styles.isLoading}>
                    <Spinner />
                    <FeedbackMessage message="Atualizando Agendamento..." />
                </div>
            ) :
                error ? (
                    <div className={styles.error}>
                        <FeedbackMessage icon={<CircleX />} message={error!} />
                        <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack} />
                    </div>
                ) :
                    isSuccess ? (
                        <div className={styles.success}>
                            <FeedbackMessage message="Consulta atualizada com sucesso!" />
                            <Button iconStart={<Signpost />} text="Voltar ao Início" onClick={handleReset} />
                        </div>
                    ) :
                        state.selectedAppointment ? (
                            <div className={styles.confirmAppointment}>
                                <h2>Confirmação da Consulta</h2>
                                <h3>Por favor, revise as informações da consulta abaixo:</h3>
                                <div className={styles.info}>
                                    <p>Paciente: <strong>{state.selectedAppointment.patient.name}</strong></p>
                                    <p>Procedimento: <strong>{state.selectedAppointment.procedure}</strong></p>
                                    <p>Dentista: <strong>Dr. {state.selectedAppointment.dentist?.name}</strong></p>
                                    <p>Data: <strong>{formatDateISO(state.selectedAppointment.scheduledAt!)}</strong></p>
                                    <p>Horário: <strong>{formatHour(state.selectedAppointment.scheduledAt!)} - {formatHour(state.selectedAppointment.endsAt!)}</strong></p>
                                    <p>Duração: <strong>{state.selectedAppointment.durationMinutes} minutos</strong></p>
                                </div>

                                <div className={styles.boxBtns}>
                                    <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack} />
                                    <Button text="Atualizar" iconEnd={<CalendarSync />} onClick={handleUpdateAppointment} disabled={!state.selectedAppointment.scheduledAt} />
                                </div>
                            </div>
                        ) : <FeedbackMessage message="Nenhuma consulta encontrada" />
            }
        </Card>
    )
}