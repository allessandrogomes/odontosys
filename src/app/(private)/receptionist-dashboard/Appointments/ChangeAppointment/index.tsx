import { useChangeAppointmentContext } from "@/contexts/ChangeAppointmentContext"
import Search from "./Search"
import SectionWrapper from "@/components/layout/SectionWrapper"

export default function ChangeAppointment() {
    const { state } = useChangeAppointmentContext()

    return (
        <SectionWrapper title="Alterar Consulta">
            <>
                {/* STEP 1 */}
                {/* Componente responsável pela busca das consultas por meio do CPF */}
                {/* Podendo retornar as consultas, ou uma mensagem de feedback em caso de erros ou não encontrar */}
                {state.step === 1 && <Search />}

                {/* Tela para escolher a consulta a editar */}
                {/* <SelectAppointmentView
                    appointmentsFound={appointmentsFound}
                    onSelectAppointment={value => {
                        setSelectedAppointment(value)
                        handleNextView()
                    }}
                    onBack={handleBackView}
                    visible={viewToShow === SELECT_APPOINTMENT_VIEW}
                /> */}

                {/* Tela para escolher qual informação alterar */}
                {/* <SelectChangeView
                    onSelectChange={value => setViewToShow(value)}
                    onBack={handleBackView}
                    visible={viewToShow === SELECT_CHANGE_VIEW}
                /> */}

                {/* Tela para alterar o Procedimento e Dentista */}
                {/* {viewToShow === PROCEDURE_AND_DENTIST && (
                    <ChangeProcedureAndDentistView
                        appointment={appointmentSelected!}
                        onUpdate={appointmentUpdated => {
                            setSelectedAppointment(appointmentUpdated)
                            updateFoundAppointments()
                        }}
                        onBack={handleBackView}
                    />
                )} */}

                {/* Tela para alterar o Dia e Horário */}
                {/* {viewToShow === TIME_AND_DAY && (
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
                )} */}
            </>
        </SectionWrapper>
    )
}