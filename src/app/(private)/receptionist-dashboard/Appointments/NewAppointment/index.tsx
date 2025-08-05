import SearchPatient from "@/app/(private)/receptionist-dashboard/Appointments/NewAppointment/SearchPatient"
import { useAppointmentContext } from "@/contexts/AppointmentContext"
import ConfirmPatient from "./ConfirmPatient"
import SelectProcedure from "./SelectProcedure"
import SelectDentist from "./SelectDentist"
import SelectScheduled from "./SelectScheduled"
import ConfirmAppointment from "./ConfirmAppointment"

export default function NewAppointment() {
    const { state } = useAppointmentContext()
    return (
        <div>
            {state.step === 1 && <SearchPatient />}
            {state.step === 2 && <ConfirmPatient />}
            {state.step === 3 && <SelectProcedure />}
            {state.step === 4 && <SelectDentist />}
            {state.step === 5 && <SelectScheduled />}
            {state.step === 6 && <ConfirmAppointment />}
        </div>
    )
}