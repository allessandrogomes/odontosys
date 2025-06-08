import styles from "./styles.module.scss"
import SearchField from "./SearchField"
import { useState } from "react"
import AppointmentsFound from "./AppointmentsFound"
import Divider from "@/components/ui/Divider"
import AppointmentCard from "@/components/cards/AppointmentCard"
import BackBtn from "@/components/ui/BackBtn"

export default function SearchAppointment() {
    const [appointments, setAppointments] = useState<IAppointment[] | []>([])
    const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null)

    return (
        <div className={styles.searchAppointment}>
            <h1>Buscar Consulta</h1>

            <Divider />

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

            {/* Mostra as informações da consulta */}
            {selectedAppointment &&
                <>
                    <AppointmentCard appointment={selectedAppointment} />
                    <BackBtn onClick={() => setSelectedAppointment(null)} />
                </>
            }
        </div>
    )
}