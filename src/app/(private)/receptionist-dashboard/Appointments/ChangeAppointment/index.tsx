import { useChangeAppointmentContext } from "@/contexts/ChangeAppointmentContext"
import SearchAppointments from "./SearchAppointments"
import SectionWrapper from "@/components/layout/SectionWrapper"
import SelectAppointment from "./SelectAppointment"
import SelectProcedure from "./SelectProcedure"
import SelectDentist from "./SelectDentist"
import SelectScheduled from "./SelectScheduled"

export default function ChangeAppointment() {
    const { state } = useChangeAppointmentContext()

    return (
        <SectionWrapper title="Alterar Consulta">
            <>
                {/* STEP 1 */}
                {/* Componente responsável pela busca das consultas por meio do CPF */}
                {/* Podendo retornar as consultas, ou uma mensagem de feedback em caso de erros ou não encontrar */}
                {state.step === 1 && <SearchAppointments />}
                
                {/* STEP 2 */}
                {/* Componente responsável por mostrar as consultas encontradas */}
                {/* O usuário deverá clicar em qual consulta deseja alterar */}
                {state.step === 2 && <SelectAppointment />}
                
                {/* STEP 3 */}
                {/* Componente responsável pela seleção do procedimento */}
                {state.step === 3 && <SelectProcedure />}

                {/* STEP 4 */}
                {/* Componente responsável pela seleção do dentista */}
                {state.step === 4 && <SelectDentist />}

                {/* STEP 5 */}
                {/* Componente responsável pela seleção do dia e horário */}
                {state.step === 5 && <SelectScheduled />}
            </>
        </SectionWrapper>
    )
}