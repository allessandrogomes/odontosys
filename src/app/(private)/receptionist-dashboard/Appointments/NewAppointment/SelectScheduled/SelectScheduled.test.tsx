import { fireEvent, render, screen } from "@testing-library/react"
import SelectScheduled from "."
import { useAppointmentContext } from "@/contexts/NewAppointmentContext"

// Mock do contexto
jest.mock("@/contexts/NewAppointmentContext", () => ({
    useAppointmentContext: jest.fn()
}))

// Mock de subcomponentes complexos
jest.mock("@/components/ui/Button", () => ({
    __esModule: true,
    default: jest.fn(({ text, iconStart, iconEnd, ...props }) => <button {...props}>{iconStart}{text}{iconEnd}</button>)
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
    const dispatchMock = jest.fn()
    beforeEach(() => {
        jest.clearAllMocks() // Reseta todos os mocks antes de cada novo it

            ; (useAppointmentContext as jest.Mock).mockReturnValue({
                state: {
                    scheduledAt: null,
                    endsAt: null,
                    durationMinutes: 30,
                    dentistId: "1"
                },
                dispatch: dispatchMock
            })
    })

    it("deve renderizar corretamente a tela inicial (snapshot)", () => {
        const { container } = render(<SelectScheduled />)
        expect(container).toMatchSnapshot()
    })

    it("deve atualizar o valor do input e chamar dispatch ao alterar a data", () => {
        render(<SelectScheduled />)

        const input = screen.getByTestId("date-input") as HTMLInputElement
        fireEvent.change(input, { target: { value: "2025-09-10" } })

        expect(input.value).toBe("2025-09-10")
        expect(dispatchMock).toHaveBeenCalledWith({
            type: "SET_SCHEDULE",
            payload: { scheduledAt: null, endsAt: null }
        })
    })
})