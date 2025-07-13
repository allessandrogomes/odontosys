import React, { useEffect, useState } from "react"
import styles from "./styles.module.scss"
import { formatHour } from "@/utils/formatHour"
import { formatDate } from "@/utils/formatDate"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight, TimerOff } from "lucide-react"
import Spinner from "@/components/ui/Spinner"
import ScheduleList from "@/components/lists/ScheduleList"
import FeedbackMessage from "@/components/ui/FeedbackMessage"

interface IScheduledView {
    durationMinutes: number | null
    dentistId: number | null
    scheduledAt: (startISO: string | null) => void
    endsAt: (endISO: string | null) => void
    onBack: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    active: boolean
}

interface ITime {
    start: string,
    end: string
}

const SELECT_DAY_AND_TIME_VIEW = "SELECT_DAY_AND_TIME_VIEW"
const SHOW_SELECTED_DAY_AND_TIME_VIEW = "SHOW_SELECTED_DAY_AND_TIME_VIEW"

export default function ScheduledView({ durationMinutes, dentistId, active, scheduledAt, endsAt, onBack, onNext }: IScheduledView) {
    const [day, setDay] = useState<string>("")
    const [times, setTimes] = useState<ITime[] | []>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedTime, setSelectedTime] = useState<ITime | null>(null)
    const [currentView, setCurrentView] = useState<string>(SELECT_DAY_AND_TIME_VIEW)

    function handleNext() {
        if (selectedTime) {
            scheduledAt(selectedTime.start)
            endsAt(selectedTime.end)
            setCurrentView(SHOW_SELECTED_DAY_AND_TIME_VIEW)
        }
    }

    useEffect(() => {
        async function getAvailableTimes() {
            setIsLoading(true)
            setSelectedTime(null)
            try {
                const response = await fetch("/api/available-times", {
                    method: "POST",
                    body: JSON.stringify({
                        date: day,
                        durationMinutes: durationMinutes,
                        dentistId: dentistId
                    })
                })

                const data = await response.json()

                if (!response.ok) throw new Error(data.error || "Erro ao buscar os horários disponíveis")

                setTimes(data)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        if (day) getAvailableTimes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [day])

    return (
        <div className={`${styles.box} ${active && styles.active}`}>
            {/* Tela para selecionar o dia e horário */}
            {currentView === SELECT_DAY_AND_TIME_VIEW && (
                <div className={styles.scheduled}>
                    <Label text="Escolha o dia e horário" />
                    <input onChange={e => setDay(e.target.value)} type="date" value={day} />

                    {isLoading ? <Spinner className={styles.spinner} />
                        : error ? <FeedbackMessage message={error} />
                            : times.length > 0 ? <ScheduleList selectedSchedule={selectedTime} schedules={times} onSelectSchedule={schedule => setSelectedTime(schedule)} />
                                : <FeedbackMessage message="Nenhum horário disponível" icon={<TimerOff />}/>
                    }

                    <div className={styles.boxBtns}>
                        <Button text="Voltar" iconStart={<ArrowLeft />} onClick={e => onBack(e)} />
                        <Button text="Próximo" iconEnd={<ArrowRight />} onClick={handleNext} disabled={!selectedTime} />
                    </div>
                </div>
            )}

            {/* Tela que mostra o dia e horário escolhido */}
            {currentView === SHOW_SELECTED_DAY_AND_TIME_VIEW && selectedTime && day && (
                <div className={styles.showSchedule}>
                    <p>Dia e o Horário selecionados: <br /><br /><span>{formatDate(day)} | {formatHour(selectedTime.start)} - {formatHour(selectedTime.end)}</span></p>
                    <div className={styles.boxBtns}>
                        <Button onClick={() => setCurrentView(SELECT_DAY_AND_TIME_VIEW)} iconStart={<ArrowLeft />} text="Voltar" />
                        <Button onClick={e => onNext(e)} iconEnd={<ArrowRight />} text="Próximo" />
                    </div>
                </div>
            )}
        </div>
    )
}
