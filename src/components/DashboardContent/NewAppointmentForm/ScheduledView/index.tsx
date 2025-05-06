import React, { useEffect, useState } from "react"
import styles from "./styles.module.scss"
import { formatHour } from "@/utils/formatHour"
import { formatDate } from "@/utils/formatDate"

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
                setTimes(data)
            } catch (error) {
                alert(JSON.stringify(error))
            }
        }

        if (day) getAvailableTimes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [day])

    return (
        <div className={`${styles.box} ${active && styles.active}`}>
            {currentView === SELECT_DAY_AND_TIME_VIEW && (
                <div className={styles.scheduled}>
                    <label>Escolha o dia e horário</label>
                    <input onChange={e => setDay(e.target.value)} type="date" value={day}/>
                    <div className={styles.timesBtns}>
                        {Array.isArray(times) && times.map((time, index) => <button className={`${selectedTime?.start === time.start && styles.selected}`} onClick={() => setSelectedTime(time)} key={index}>{formatHour(time.start)} - {formatHour(time.end)}</button>)}
                    </div>
                    <div className={styles.boxBtns}>
                        <button onClick={e => onBack(e)} className={styles.backBtn}>Voltar</button>
                        <button onClick={handleNext} disabled={!selectedTime} className={`${styles.nextBtn} ${selectedTime && styles.active}`}>Próximo</button>
                    </div>
                </div>
            )}

            {currentView === SHOW_SELECTED_DAY_AND_TIME_VIEW && selectedTime && day && (
                <div className={styles.showSchedule}>
                    <p>Dia e o Horário selecionados: <br/><br/><span>{formatDate(day)} | {formatHour(selectedTime.start)} - {formatHour(selectedTime.end)}</span></p>
                    <div className={styles.boxBtns}>
                        <button onClick={() => setCurrentView(SELECT_DAY_AND_TIME_VIEW)} className={styles.backBtn}>Voltar</button>
                        <button onClick={e => onNext(e)} className={styles.nextBtn}>Próximo</button>
                    </div>
                </div>
            )}
        </div>
    )
}
