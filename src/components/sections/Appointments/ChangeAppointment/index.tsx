
import { useState } from "react"
import SearchView from "./SearchView"
import SelectAppointmentView from "./SelectAppointment"
import SelectChangeView from "./SelectChangeView"
import ChangeProcedureAndDentistView from "./ChangeProcedureAndDentistView"
import DayAndTimeView from "./DayAndTimeView"
import toast, { Toaster } from "react-hot-toast"
import SectionWrapper from "@/components/layout/SectionWrapper"

const SEARCH_VIEW = "SEARCH_VIEW"
const SELECT_APPOINTMENT_VIEW = "SELECT_APPOINTMENT_VIEW"
const SELECT_CHANGE_VIEW = "SELECT_CHANGE_VIEW"
const PROCEDURE_AND_DENTIST = "PROCEDURE_AND_DENTIST"
const TIME_AND_DAY = "TIME_AND_DAY"

export default function ChangeAppointment() {
    const [viewToShow, setViewToShow] = useState<string>(SEARCH_VIEW)
    const [appointmentsFound, setAppointmentsFound] = useState<IAppointment[] | []>([])
    const [appointmentSelected, setSelectedAppointment] = useState<IAppointment | null>(null)

    function handleNextView() {
        if (viewToShow === SEARCH_VIEW) {
            setViewToShow(SELECT_APPOINTMENT_VIEW)
        } else if (viewToShow === SELECT_APPOINTMENT_VIEW) {
            setViewToShow(SELECT_CHANGE_VIEW)
        }
    }

    function handleBackView() {
        if (viewToShow === SELECT_APPOINTMENT_VIEW) {
            setViewToShow(SEARCH_VIEW)
        } else if (viewToShow === SELECT_CHANGE_VIEW) {
            setViewToShow(SELECT_APPOINTMENT_VIEW)
        } else if (viewToShow === PROCEDURE_AND_DENTIST || viewToShow === TIME_AND_DAY) {
            setViewToShow(SELECT_CHANGE_VIEW)
        }
    }

    async function updateFoundAppointments() {
        try {
            const response = await fetch(`/api/appointment/cpf/${appointmentSelected?.patient.cpf}`, {
                method: "GET"
            })
            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao buscar as consultas")

            if (data.length === 0) {
                setAppointmentsFound([])
                throw new Error("Nenhuma consulta encontrada")
            }

            setAppointmentsFound(data)
        } catch (error) {
            alert(JSON.stringify(error))
        }
    }

    return (
        <SectionWrapper title="Alterar Consulta">
            <>
                {/* Tela de busca das consultas por meio do CPF do Paciente */}
                <SearchView
                    appointmentsFound={value => {
                        setAppointmentsFound(value)
                        if (value.length > 0) handleNextView()
                    }}
                    visible={viewToShow === SEARCH_VIEW}
                />

                {/* Tela para escolher a consulta a editar */}
                <SelectAppointmentView
                    appointmentsFound={appointmentsFound}
                    onSelectAppointment={value => {
                        setSelectedAppointment(value)
                        handleNextView()
                    }}
                    onBack={handleBackView}
                    visible={viewToShow === SELECT_APPOINTMENT_VIEW}
                />

                {/* Tela para escolher qual informação alterar */}
                <SelectChangeView
                    onSelectChange={value => setViewToShow(value)}
                    onBack={handleBackView}
                    visible={viewToShow === SELECT_CHANGE_VIEW}
                />

                {/* Tela para alterar o Procedimento e Dentista */}
                {viewToShow === PROCEDURE_AND_DENTIST && (
                    <ChangeProcedureAndDentistView
                        appointment={appointmentSelected!}
                        onUpdate={appointmentUpdated => {
                            setSelectedAppointment(appointmentUpdated)
                            updateFoundAppointments()
                        }}
                        onBack={handleBackView}
                    />
                )}

                {/* Tela para alterar o Dia e Horário */}
                {viewToShow === TIME_AND_DAY && (
                    <DayAndTimeView
                        appointment={appointmentSelected!}
                        onUpdate={appointment => {
                            setSelectedAppointment(appointment)
                            handleBackView()
                            toast.success("Informações alteradas com sucesso!")
                            updateFoundAppointments()
                        }}
                        onBack={handleBackView}
                    />
                )}
                <Toaster />
            </>
        </SectionWrapper>
    )
}