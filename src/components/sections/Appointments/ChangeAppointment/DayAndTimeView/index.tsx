import styles from "./styles.module.scss"
import { useEffect, useState } from "react"
import Spinner from "@/components/ui/Spinner"
import ScheduleList from "@/components/lists/ScheduleList"
import Label from "@/components/ui/Label"
import BackBtn from "@/components/ui/BackBtn"
import Button from "@/components/ui/Button"

interface ITime {
    start: string,
    end: string
}

interface IDayAndTimeView {
    appointment: IAppointment
    onUpdate: (appointment: IAppointment) => void
    onBack: (onBack: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export default function DayAndTimeView({ appointment, onUpdate, onBack }: IDayAndTimeView) {
    const [day, setDay] = useState<string>("")
    const [times, setTimes] = useState<ITime[] | []>([])
    const [selectedTime, setSelectedTime] = useState<ITime | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)

    async function handleSubmitPatch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmiting(true)
        try {
            const response = await fetch(`/api/appointment/id/${appointment.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scheduledAt: selectedTime?.start,
                    endsAt: selectedTime?.end
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao atualizar os dados")
            onUpdate(data)
        } catch (error) {
            alert(JSON.stringify(error))
        } finally {
            setIsSubmiting(false)
        }
    }

    useEffect(() => {
        async function getAvailableTimes() {
            setSelectedTime(null)
            setIsLoading(true)
            try {
                const response = await fetch("/api/available-times", {
                    method: "POST",
                    body: JSON.stringify({
                        date: day,
                        durationMinutes: appointment.durationMinutes,
                        dentistId: appointment.dentistId
                    })
                })

                const data = await response.json()
                setTimes(data)
            } catch (error) {
                alert(JSON.stringify(error))
            } finally {
                setIsLoading(false)
            }
        }

        if (day) getAvailableTimes()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [day])

    return (
        <form onSubmit={handleSubmitPatch} className={styles.dayAndTime}>
            <BackBtn onClick={onBack}/>
            <div className={styles.day}>
                <Label text="Selecione o Dia e Horário" />
                <input onChange={e => setDay(e.target.value)} type="date" value={day} />
            </div>
            {isLoading ? (
                <Spinner />
            ) : day !== "" ? (
                <ScheduleList
                    selectedSchedule={selectedTime}
                    schedules={times}
                    onSelectSchedule={schedule => setSelectedTime(schedule)}
                />
            ) : (
                ""
            )}
            {isSubmiting ? (
                <Spinner />
            ) : (
                <Button type="submit" text="Concluir" disabled={!selectedTime} />
            )}
        </form>
    )
}