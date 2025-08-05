import { formatHour } from "@/utils/formatHour"
import styles from "./styles.module.scss"
import { useAppointmentContext } from "@/contexts/AppointmentContext"

interface ISchedule {
    start: string | null
    end: string | null
}

interface IScheduleList {
    availableTimes: ISchedule[]
    onSelectSchedule: (schedule: ISchedule) => void
}

export default function ScheduleList({ availableTimes, onSelectSchedule }: IScheduleList) {
    const { state } = useAppointmentContext()
    
    return (
        <div className={styles.schedules}>
            {Array.isArray(availableTimes) && availableTimes.map((schedule, index) =>
                <button
                    type="button"
                    className={`${state?.scheduledAt === schedule.start && styles.selected}`}
                    onClick={() => onSelectSchedule(schedule)}
                    key={index}
                >
                    {formatHour(schedule.start!)} - {formatHour(schedule.end!)}
                </button>
            )}
        </div>
    )
}