import styles from "./styles.module.scss"
import SearchField from "./SearchField"
import { useState } from "react"
import AppointmentsFound from "./AppointmentsFound"
import AppointmentInformation from "./AppointmentInformation"

export default function SearchAppointment() {
    const [appointments, setAppointments] = useState<IAppointment[] | []>([])
    const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null)

    return (
        <div className={styles.searchAppointment}>
            <h1>Buscar Consulta</h1>

            <div className={styles.divider}></div>

            {/* Componente para buscar as consultas por CPF, e retorna ao encontrar */}
            <SearchField
                appointmentsFound={appointments => setAppointments(appointments)}
                visible={!selectedAppointment}
            />

            {/* Mostra todas as consultas encontradas e retorna a clicada/selecionada */}
            {appointments.length > 0 &&
                <AppointmentsFound
                    appointments={appointments}
                    selectedAppointment={appointment => setSelectedAppointment(appointment)}
                    visible={!selectedAppointment}
                />
            }

            {selectedAppointment && 
                <AppointmentInformation 
                    appointment={selectedAppointment}
                    onBack={() => setSelectedAppointment(null)}
                />}
        </div>
    )
}