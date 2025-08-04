import SearchPatient from "@/app/(private)/receptionist-dashboard/Appointments/NewAppointment/SearchPatient"
import { useAppointmentContext } from "@/contexts/AppointmentContext"
import ConfirmPatient from "./ConfirmPatient"
import SelectProcedure from "./SelectProcedure"
import SelectDentist from "./SelectDentist"

export default function NewAppointment() {
    const { state } = useAppointmentContext()
    return (
        <div>
            <p>{state.patientId}</p>
            <p>{state.patientName}</p>
            <p>{state.procedure}</p>
            <p>{state.durationMinutes}</p>
            <p>{state.dentistName}</p>
            {state.step === 1 && <SearchPatient />}
            {state.step === 2 && <ConfirmPatient />}
            {state.step === 3 && <SelectProcedure />}
            {state.step === 4 && <SelectDentist />}
            {state.step === 5 && <>Step 5</>}
        </div>
    )
}