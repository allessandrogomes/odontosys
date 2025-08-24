import React, { useEffect, useState } from "react"
import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight, Info, Search, TimerOff } from "lucide-react"
import Spinner from "@/components/ui/Spinner"
import ScheduleList from "@/components/lists/ScheduleList"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import { useChangeAppointmentContext } from "@/contexts/ChangeAppointmentContext"

interface ISchedule {
    start: string | null
    end: string | null
}

function formatDateISO(dateISO: string) {
    if (!dateISO) return ""
    return new Date(dateISO).toISOString().split("T")[0] // pega só YYYY-MM-DD
}

export default function SelectScheduled() {
    const { state, dispatch } = useChangeAppointmentContext()

    const [day, setDay] = useState<string>(formatDateISO(state.selectedAppointment?.scheduledAt ?? "") || "")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [availableTimes, setAvailableTimes] = useState<ISchedule[] | null>(null)

    // Se existir horário definido cria o objeto de horário selecionado
    // Caso contrário, lança o valor com nulo
    const selectedSchedule: ISchedule | null =
        state.selectedAppointment?.scheduledAt && state.selectedAppointment.endsAt
            ? {
                start: state.selectedAppointment.scheduledAt,
                end: state.selectedAppointment.endsAt
            } : null

    // Função para buscar horários disponíveis
    async function getAvailableTimes(event?: React.FormEvent<HTMLFormElement>) {
        if (event) event.preventDefault()

        setIsLoading(true)
        setError(null)
        setAvailableTimes(null)

        if (!day) {
            setError("Por favor, selecione um dia.")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("/api/available-times", {
                method: "POST",
                body: JSON.stringify({
                    date: day,
                    durationMinutes: state.selectedAppointment?.durationMinutes ?? 0,
                    dentistId: state.selectedAppointment?.dentistId ?? "",
                    appointmentId: state.selectedAppointment?.id ?? 0
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao buscar os horários disponíveis")

            setAvailableTimes(data)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Lida com a alteração da data
    // Sempre que alterar a data, é preciso limpar os valores atuais
    // Evita enviar data que não corresponde ao horário selecionado atualmente
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDay(event.target.value)
        setAvailableTimes(null)
        dispatch({
            type: "SET_SELECTED_APPOINTMENT",
            payload: state.selectedAppointment
                ? { ...state.selectedAppointment, scheduledAt: null, endsAt: null }
                : null
        })
    }

    // Função para lidar com a seleção de horário
    function handleSelectSchedule(schedule: ISchedule) {
        dispatch({
            type: "SET_SELECTED_APPOINTMENT",
            payload: state.selectedAppointment
                ? { ...state.selectedAppointment, scheduledAt: schedule.start, endsAt: schedule.end }
                : null
        })
    }

    // Voltar para a etapa anterior
    function handleBack() {
        dispatch({ type: "SET_STEP", payload: 4 })
    }

    // Avança para a próxima etapa
    function handleNext() {
        dispatch({ type: "SET_STEP", payload: 6 })
    }

    // Ao montar o componente, caso já exista uma data
    // buscar os horários disponíveis
    useEffect(() => {
        if (day) {
            getAvailableTimes()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={styles.container}>
            {/* Formulário para buscar horários disponíveis de acordo com a data selecionda */}
            <form onSubmit={getAvailableTimes}>
                <Label text="Escolha o dia e horário" />
                <input onChange={handleChange} type="date" value={day} required />
                <Button text="Buscar horários" iconEnd={<Search />} type="submit" disabled={isLoading} />
            </form>

            {/* Renderiza a lista de horários disponíveis ou mensagens de feedback */}
            <div className={styles.scheduled}>
                {isLoading ? <Spinner className={styles.spinner} />
                    : error ? <FeedbackMessage message={error} />
                        : availableTimes && availableTimes.length > 0 ? <ScheduleList schedules={availableTimes} onSelectSchedule={schedule => handleSelectSchedule(schedule)} selectedSchedule={selectedSchedule} />
                            : availableTimes && availableTimes.length === 0 ? <FeedbackMessage message="Nenhum horário disponível" icon={<TimerOff />} />
                                : !availableTimes ? <FeedbackMessage icon={<Info />} message="Busque por horários disponíveis..." />
                                    : <></>
                }
            </div>

            {/* Botões de Voltar e Próximo */}
            <div className={styles.boxBtns}>
                <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack} />
                <Button text="Próximo" iconEnd={<ArrowRight />} onClick={handleNext} disabled={!state.selectedAppointment || !state.selectedAppointment.scheduledAt} />
            </div>
        </div>
    )
}
