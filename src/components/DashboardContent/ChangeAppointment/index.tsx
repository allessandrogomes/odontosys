import styles from "./styles.module.scss"
import { useEffect, useState } from "react"
import SearchView from "./SearchView"
import SelectAppointmentView from "./SelectAppointment"
import SelectChangeView from "./SelectChangeView"

const SEARCH_VIEW = "SEARCH_VIEW"
const SELECT_APPOINTMENT_VIEW = "SELECT_APPOINTMENT_VIEW"
const SELECT_CHANGE_VIEW = "SELECT_CHANGE_VIEW"
const PROCEDURE_AND_DENTIST = "PROCEDURE_AND_DENTIST"

export default function ChangeAppointment() {
    const [viewToShow, setViewToShow] = useState<string>(SEARCH_VIEW)
    const [appointmentsFound, setAppointmentsFound] = useState<IAppointment[] | []>([])
    const [appointmentSelected, setSelectedAppointment] = useState<IAppointment | null>(null)
    const [selectedChange, setSelectedChange] = useState<string | null>(null)

    function handleNextView() {
        
    }

    function handleBackView() {
        if (viewToShow === SELECT_APPOINTMENT_VIEW) {
            setViewToShow(SEARCH_VIEW)
        } else if (viewToShow === SELECT_CHANGE_VIEW) {
            setViewToShow(SELECT_APPOINTMENT_VIEW)
        }
    }

    useEffect(() => {
        if (viewToShow === SEARCH_VIEW) {
            if (appointmentsFound.length > 0) {
                setViewToShow(SELECT_APPOINTMENT_VIEW)
            }
        } else if (viewToShow === SELECT_APPOINTMENT_VIEW) {
            setViewToShow(SELECT_CHANGE_VIEW)
        }
    }, [appointmentsFound, appointmentSelected])

    return (
        <div className={styles.containerChangeAppointment}>
            {/* Tela de busca das consultas por meio do CPF do Paciente */}
            <SearchView
                appointmentsFound={value => setAppointmentsFound(value)}
                visible={viewToShow === SEARCH_VIEW}
            />

            {/* Tela para escolher a consulta a editar */}
            <SelectAppointmentView
                appointmentsFound={appointmentsFound}
                onSelectAppointment={value => setSelectedAppointment(value)}
                onBack={handleBackView}
                visible={viewToShow === SELECT_APPOINTMENT_VIEW}
            />

            {/* Tela para escolher qual informação alterar */}
            <SelectChangeView 
                onSelectChange={value => setSelectedChange(value)}
                onBack={handleBackView}
                visible={viewToShow === SELECT_CHANGE_VIEW}
            />
        </div>
    )
}