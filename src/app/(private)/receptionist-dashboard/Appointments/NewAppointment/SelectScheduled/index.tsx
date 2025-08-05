import React, { useState } from "react"
import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight, TimerOff } from "lucide-react"
import Spinner from "@/components/ui/Spinner"
import ScheduleList from "@/components/lists/ScheduleList"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import { useAppointmentContext } from "@/contexts/AppointmentContext"

interface ISchedule {
    start: string | null
    end: string | null
}

export default function SelectScheduled() {
    const [day, setDay] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [availableTimes, setAvailableTimes] = useState<ISchedule[] | [] | null>(null)

    const { state, dispatch } = useAppointmentContext()

    // Função para buscar horários disponíveis
    async function getAvailableTimes(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
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
                    durationMinutes: state.durationMinutes,
                    dentistId: state.dentistId
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

    // Função para lidar com a seleção de horário
    function handleSelectSchedule(schedule: ISchedule) {
        dispatch({
            type: "SET_SCHEDULE",
            payload: {
                scheduledAt: schedule.start,
                endsAt: schedule.end
            }
        })
    }

    function handleBack() {
        dispatch({ type: "SET_SCHEDULE", payload: { scheduledAt: null, endsAt: null } })
        dispatch({ type: "SET_STEP", payload: 4 })
    }

    function handleNext() {
        dispatch({ type: "SET_STEP", payload: 6 }) // Avança para o próximo passo
    }

    return (
        <div className={styles.box}>
            <div className={styles.scheduled}>
                <form onSubmit={getAvailableTimes}>
                    <Label text="Escolha o dia e horário" />
                    <input onChange={e => setDay(e.target.value)} type="date" value={day} required />
                    <button type="submit">Ok</button>
                </form>

                {/* Renderiza a lista de horários disponíveis ou mensagens de feedback */}
                {isLoading ? <Spinner className={styles.spinner} />
                    : error ? <FeedbackMessage message={error} />
                        : availableTimes && availableTimes.length > 0 ? <ScheduleList availableTimes={availableTimes} onSelectSchedule={schedule => handleSelectSchedule(schedule)} />
                            : availableTimes && availableTimes.length === 0 ? <FeedbackMessage message="Nenhum horário disponível" icon={<TimerOff />} />
                                : <></>
                }

                <div className={styles.boxBtns}>
                    <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack}/>
                    <Button text="Próximo" iconEnd={<ArrowRight />} onClick={handleNext} disabled={!state.scheduledAt} />
                </div>
            </div>
        </div>
    )
}
