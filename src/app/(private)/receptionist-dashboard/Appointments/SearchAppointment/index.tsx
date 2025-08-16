import SearchField from "./SearchField"
import AppointmentsFound from "./AppointmentsFound"
import SectionWrapper from "@/components/layout/SectionWrapper"
import { useSearchAppointmentContext } from "@/contexts/SearchAppointmentContext"
import AppointmentInfo from "./AppointmentInfo"

export default function SearchAppointment() {
    const { state } = useSearchAppointmentContext()

    return (
        <SectionWrapper title="Buscar Consulta">
            <>
                {state.step === 1 && <SearchField />}
                {state.step === 2 && <AppointmentsFound />}
                {state.step === 3 && <AppointmentInfo />}
            </>
        </SectionWrapper>
    )
}