import SearchField from "./SearchField"
import { useState } from "react"
import AppointmentsFound from "./AppointmentsFound"
import AppointmentCard from "@/components/cards/AppointmentCard"
import BackBtn from "@/components/ui/BackBtn"
import SectionWrapper from "@/components/layout/SectionWrapper"

export default function SearchAppointment() {
    const [appointments, setAppointments] = useState<IAppointment[] | []>([])
    const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null)

    return (
        <SectionWrapper title="Buscar Consulta">
            <>
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
            </>
        </SectionWrapper>
    )
}