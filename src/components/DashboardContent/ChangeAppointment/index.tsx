import styles from "./styles.module.scss"
import { useState } from "react"
import SearchAndSelectAppointmentView from "./SearchAndSelectAppointmentView"
import ChangeAppointmentView from "./ChangeAppointmentView"

const SEARCH_AND_SELECT = "SEARCH_AND_SELECT"
const CHANGE = "CHANGE"

export default function ChangeAppointment() {
    const [viewToShow, setViewToShow] = useState<string>(SEARCH_AND_SELECT)
    const [appointment, setAppointment] = useState<IAppointment | null>(null)

    function handleSelectedAppointment(app: IAppointment) {
        setAppointment(app)
        handleNextView()
    }

    function handleNextView() {
        if (viewToShow === SEARCH_AND_SELECT) {
            setViewToShow(CHANGE)
        }
    }

    function handleBackView() {
        if (viewToShow === CHANGE) {
            setViewToShow(SEARCH_AND_SELECT)
        }
    }

    return (
        <div className={styles.containerChangeAppointment}>
            {viewToShow === SEARCH_AND_SELECT && 
                <SearchAndSelectAppointmentView 
                    onSelectAppointment={app => handleSelectedAppointment(app)}
                />}
            {viewToShow === CHANGE && <ChangeAppointmentView />}
        </div>
    )
}