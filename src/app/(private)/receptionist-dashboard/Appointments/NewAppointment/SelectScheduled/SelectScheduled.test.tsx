import { render } from "@testing-library/react"
import SelectScheduled from "."
import { useAppointmentContext } from "@/contexts/NewAppointmentContext"

// Mock do contexto
jest.mock("@/contexts/NewAppointmentContext", () => ({
    useAppointmentContext: jest.fn().mockReturnValue({
        state: { scheduledAt: null, endsAt: null, durationMinutes: 60 }
    })
}))

describe("SelectScheduled", () => {
    // Mock global do dispatch
    const dispatchMock = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks() // Reseta todos os mocks antes de cada novo it
    })

    it("deve renderizar corretamente a tela inicial (snapshot)", () => {
        const { container } = render(<SelectScheduled />)
        expect(container).toMatchSnapshot()
    })
})