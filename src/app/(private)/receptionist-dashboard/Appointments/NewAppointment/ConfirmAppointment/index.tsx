import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import styles from "./styles.module.scss"
import { useAppointmentContext } from "@/contexts/AppointmentContext"
import { formatDateISO } from "@/utils/formatDateISO"
import { formatHour } from "@/utils/formatHour"
import { ArrowLeft, CalendarCheck, CircleX, Signpost } from "lucide-react"
import { useState } from "react"
import Spinner from "@/components/ui/Spinner"
import FeedbackMessage from "@/components/ui/FeedbackMessage"


export default function ConfirmAppointment() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const { state, dispatch } = useAppointmentContext()

    function handleBack() {
        dispatch({ type: "SET_STEP", payload: 5 })
        dispatch({ type: "SET_SCHEDULE", payload: { scheduledAt: null, endsAt: null } })
    }

    // Objeto que contém os dados da consulta
    // Esses dados são coletados do estado do contexto de agendamento
    // Eles serão enviados para a API quando o usuário confirmar o agendamento
    const appointment = {
        patientId: state.patientId,
        dentistId: state.dentistId,
        scheduledAt: state.scheduledAt,
        endsAt: state.endsAt,
        durationMinutes: state.durationMinutes,
        procedure: state.procedure
    }


    // Função que lida com o envio dos dados do agendamento para a API
    // Ela é chamada quando o usuário clica no botão "Agendar"
    async function handleToSchedule() {
        setIsLoading(true)
        setError(null)
        setIsSuccess(false)

        // Simula um tempo mínimo de carregamento de 2 segundos
        // Isso é útil para melhorar a experiência do usuário, evitando que a tela de carregamento
        // apareça por um tempo muito curto
        const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000))

        try {
            const fetchRequest = await fetch("/api/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointment)
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
    // Isso é útil para reiniciar o processo de agendamento
    function handleReset() {
        dispatch({ type: "RESET_APPOINTMENT" })
        dispatch({ type: "SET_STEP", payload: 1 })
    }

    return (
        <Card width="500px" height="300px">
            {isLoading ? (
                <div className={styles.isLoading}>
                    <Spinner />
                    <FeedbackMessage message="Realizando Agendamento..."/>
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
                            <FeedbackMessage message="Consulta agendada com sucesso!" />
                            <Button iconStart={<Signpost />} text="Voltar ao Início" onClick={handleReset} />
                        </div>
                    ) :
                        (
                            <div className={styles.confirmAppointment}>
                                <h2>Confirmação da Consulta</h2>
                                <h3>Por favor, revise as informações da consulta abaixo:</h3>
                                <div className={styles.info}>
                                    <p>Paciente: <strong>{state.patientName}</strong></p>
                                    <p>Procedimento: <strong>{state.procedure}</strong></p>
                                    <p>Dentista: <strong>Dr. {state.dentistName}</strong></p>
                                    <p>Data: <strong>{formatDateISO(state.scheduledAt!)}</strong></p>
                                    <p>Horário: <strong>{formatHour(state.scheduledAt!)} - {formatHour(state.endsAt!)}</strong></p>
                                    <p>Duração: <strong>{state.durationMinutes} minutos</strong></p>
                                </div>

                                <div className={styles.boxBtns}>
                                    <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack} />
                                    <Button text="Agendar" iconEnd={<CalendarCheck />} onClick={handleToSchedule} disabled={!state.scheduledAt} />
                                </div>
                            </div>
                        )
            }
        </Card>
    )
}