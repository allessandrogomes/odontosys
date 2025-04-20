import { useEffect, useState } from "react"

interface IScheduledView {
    durationMinutes: number | null
    dentistId: number | null
    scheduledAt: (startISO: string | null) => void
    endsAt: (endISO: string | null) => void
}

interface ISlot {
    start: string
    end: string
    startISO: string
    endISO: string
}

interface IAvailableTimes {
    day: string
    slots: ISlot[]
}

interface ISelectedTimes {
    day: string | null
    start: string | null
    end: string | null
}

export default function ScheduledView({ durationMinutes, dentistId, scheduledAt, endsAt }: IScheduledView) {
    const [availableTimes, setAvailableTimes] = useState<IAvailableTimes[]>([])
    const [selectedTimes, setSelectedTimes] = useState<ISelectedTimes>({
        day: null,
        start: null,
        end: null
    })

    function handleSelectTime(day: string, slot: ISlot) {
        scheduledAt(slot.startISO)
        endsAt(slot.endISO)
        setSelectedTimes({
            day: day,
            start: slot.start,
            end: slot.end
        })
    }

    function handleChangeTime() {
        scheduledAt(null)
        endsAt(null)
        setSelectedTimes({ day: null, start: null, end: null })
    }

    useEffect(() => {
        async function fetchAvailableTimes() {
            try {
                const response = await fetch("/api/available-times", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        dentistId: dentistId,
                        durationMinutes: durationMinutes
                    })
                })

                const data = await response.json()
                setAvailableTimes(data)
            } catch (error) {
                alert(JSON.stringify(error))
            }
        }

        fetchAvailableTimes()
    }, [durationMinutes, dentistId])

    return (
        <div>
            {availableTimes && selectedTimes.day === null && availableTimes.map(day => (
                <div key={day.day}>
                    <h4>{day.day}</h4>
                    {day.slots.length ? (
                        day.slots.map((slot, index) => (
                            <div onClick={() => handleSelectTime(day.day, slot)} key={index}>
                                {slot.start} - {slot.end}
                            </div>
                        ))
                    ) : (
                        <p>Sem horários disponíveis</p>
                    )}
                </div>
            ))}

            {selectedTimes.day !== null && (
                <>
                    <p>Agendar consulta para o dia e horário: {selectedTimes.day}, {selectedTimes.start} - {selectedTimes.end}</p>
                    <button onClick={handleChangeTime}>Trocar horário</button>
                </>
            )}
        </div>
    )
}
