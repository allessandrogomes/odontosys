import { createContext, useReducer, useContext, ReactNode } from "react"

type Appointment = {
    patientName: string | null
    patientId: number | null
    dentistName: string | null
    dentistId: number | null
    scheduledAt: string | null
    endsAt: string | null
    durationMinutes: number | null
    procedure: string | null
    step: number
}

type State = Appointment

type Action =
    | { type: "SET_PATIENT"; payload: { id: number | null; name: string | null } }
    | { type: "SET_DENTIST"; payload: { id: number | null; name: string | null } }
    | { type: "SET_SCHEDULE"; payload: { scheduledAt: string | null; endsAt: string | null } }
    | { type: "SET_PROCEDURE"; payload: { procedure: string | null; durationMinutes: number | null }  }
    | { type: "SET_STEP"; payload: number }
    | { type: "RESET_APPOINTMENT" }

const initialState: State = {
    patientName: null,
    patientId: null,
    dentistName: null,
    dentistId: null,
    scheduledAt: null,
    endsAt: null,
    durationMinutes: null,
    procedure: null,
    step: 1
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_PATIENT":
            return {
                ...state,
                patientId: action.payload.id,
                patientName: action.payload.name,
            }
        case "SET_DENTIST":
            return {
                ...state,
                dentistId: action.payload.id,
                dentistName: action.payload.name,
            }
        case "SET_SCHEDULE":
            return {
                ...state,
                scheduledAt: action.payload.scheduledAt,
                endsAt: action.payload.endsAt,
            }
        case "SET_PROCEDURE":
            return {
                ...state,
                procedure: action.payload.procedure,
                durationMinutes: action.payload.durationMinutes,
            }
        case "SET_STEP":
            return {
                ...state,
                step: action.payload
            }
        case "RESET_APPOINTMENT":
            return initialState
        default:
            return state
    }
}

const AppointmentContext = createContext<{
    state: State
    dispatch: React.Dispatch<Action>
} | undefined>(undefined)

export function AppointmentProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <AppointmentContext.Provider value={{ state, dispatch }}>
            {children}
        </AppointmentContext.Provider>
    )
}

export function useAppointmentContext() {
    const context = useContext(AppointmentContext)
    if (!context) {
        throw new Error("useAppointment must be used within an AppointmentProvider")
    }
    return context
}