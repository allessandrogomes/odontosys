import { createContext, useReducer, useContext, ReactNode } from "react"

type ChangeAppointmentState = {
    appointments: IAppointment[] | [] | null
    selectedAppointment: IAppointment | null
    step: number
}

type State = ChangeAppointmentState

type Action =
    | { type: "SET_APPOINTMENTS"; payload: IAppointment[] | [] | null }
    | { type: "SET_SELECTED_APPOINTMENT"; payload: IAppointment | null }
    | { type: "SET_STEP"; payload: number }

const initialState: State = {
    appointments: null,
    selectedAppointment: null,
    step: 1
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_APPOINTMENTS":
            return {
                ...state,
                appointments: action.payload
            }
        case "SET_SELECTED_APPOINTMENT":
            return {
                ...state,
                selectedAppointment: action.payload
            }
        case "SET_STEP":
            return {
                ...state,
                step: action.payload
            }
        default:
            return state
    }
}

const ChangeAppointmentContext = createContext<{
    state: State
    dispatch: React.Dispatch<Action>
} | undefined>(undefined)

export function ChangeAppointmentProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <ChangeAppointmentContext.Provider value={{ state, dispatch }}>
            {children}
        </ChangeAppointmentContext.Provider>
    )
}

export function useChangeAppointmentContext() {
    const context = useContext(ChangeAppointmentContext)
    if (!context) {
        throw new Error("useChangeAppointmentContext must be used within and ChangeAppointmentProvider")
    }
    return context
}