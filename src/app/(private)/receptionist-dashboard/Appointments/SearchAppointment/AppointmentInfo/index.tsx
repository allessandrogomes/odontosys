import AppointmentCard from "@/components/cards/AppointmentCard"
import BackBtn from "@/components/ui/BackBtn"
import { useSearchAppointmentContext } from "@/contexts/SearchAppointmentContext"


export default function AppointmentInfo() {
    const { dispatch, state } = useSearchAppointmentContext()

    function handleBack() {
        dispatch({ type: "SET_SELECTED_APPOINTMENT", payload: null })
        dispatch({ type: "SET_STEP", payload: 2 })
    }

    return (
        <>
        <AppointmentCard appointment={state.selectedAppointment!} />
        <BackBtn onClick={handleBack}/>
        </>
    )
}