import { formatHour } from "@/utils/formatHour"
import styles from "./styles.module.scss"

interface ISchedule {
    start: string
    end: string
}

interface IScheduleList {
    schedules: ISchedule[]
    selectedSchedule: ISchedule | null
    onSelectSchedule: (schedule: ISchedule) => void
}

export default function ScheduleList({ schedules, selectedSchedule, onSelectSchedule }: IScheduleList) {
    return (
        <div className={styles.schedules}>
            {Array.isArray(schedules) && schedules.map((schedule, index) =>
                <button
                    type="button"
                    className={`${selectedSchedule?.start === schedule.start && styles.selected}`}
                    onClick={() => onSelectSchedule(schedule)}
                    key={index}
                >
                    {formatHour(schedule.start)} - {formatHour(schedule.end)}
                </button>
            )}
        </div>
    )
}