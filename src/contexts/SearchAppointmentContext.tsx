import { createContext, useReducer, useContext, ReactNode } from "react"

type SearchAppointmentState = {
    appointments: IAppointment[] | [] | null
    selectedAppointment: IAppointment | null
    step: number
}

type State = SearchAppointmentState

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

const SearchAppointmentContext = createContext<{
    state: State
    dispatch: React.Dispatch<Action>
} | undefined>(undefined)

export function SearchAppointmentProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <SearchAppointmentContext.Provider value={{ state, dispatch }}>
            {children}
        </SearchAppointmentContext.Provider>
    )
}

export function useSearchAppointmentContext() {
    const context = useContext(SearchAppointmentContext)
    if (!context) {
        throw new Error("useSearchAppointment must be used within an SearchAppointmentProvider")
    }
    return context
}