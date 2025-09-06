import { render } from "@testing-library/react"
import SelectScheduled from "."
import { useAppointmentContext } from "@/contexts/NewAppointmentContext"

// Mock do contexto
jest.mock("@/contexts/NewAppointmentContext", () => ({
    useAppointmentContext: jest.fn()
}))

// Mock de subcomponentes complexos
jest.mock("@/components/ui/Button", () => ({
    __esModule: true,
    default: jest.fn(({ text }) => <button>{text}</button>)
}))
jest.mock("@/components/ui/Spinner", () => ({
    __esModule: true,
    default: jest.fn(() => <div>Spinner</div>)
}))
jest.mock("@/components/ui/FeedbackMessage", () => ({
    __esModule: true,
    default: jest.fn(({ message }) => <div>{message}</div>)
}))
jest.mock("@/components/lists/ScheduleList", () => ({
    __esModule: true,
    default: jest.fn(() => <div>ScheduleList</div>)
}))

describe("SelectScheduled", () => {
    beforeEach(() => {
        jest.clearAllMocks() // Reseta todos os mocks antes de cada novo it

            ; (useAppointmentContext as jest.Mock).mockReturnValue({
                state: {
                    scheduledAt: null,
                    endsAt: null,
                    durationMinutes: 30,
                    dentistId: "1"
                },
                dispatch: jest.fn()
            })
    })

    it("deve renderizar corretamente a tela inicial (snapshot)", () => {
        const { container } = render(<SelectScheduled />)
        expect(container).toMatchSnapshot()
    })
})