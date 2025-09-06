import { fireEvent, render, screen } from "@testing-library/react"
import SelectScheduled from "."
import { useAppointmentContext } from "@/contexts/NewAppointmentContext"
import ScheduleList from "@/components/lists/ScheduleList"

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

beforeAll(() => {
    // garante que fetch exista no ambiente de teste
    globalThis.fetch = jest.fn()
})

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

    it("deve lidar corretamente com o carregamento, erro e sucesso ao buscar horários disponíveis", async () => {
        // Mock global de fetch
        const mockFetch = jest.spyOn(globalThis, "fetch")

        // 1 - Cenário de loading
        mockFetch.mockImplementationOnce(() =>
            new Promise(() => { }) // nunca resolve -> força loading
        )

        render(<SelectScheduled />)

        // Preenche a data primeiro para evitar erro de validação
        const input = screen.getByTestId("date-input")
        fireEvent.change(input, { target: { value: "2025-09-10" } })

        const form = screen.getByTestId("schedule-form")
        fireEvent.submit(form)

        expect(await screen.findByText("Spinner")).toBeInTheDocument()

        // 2 - Cenário de erro
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Erro ao buscar os horários disponíveis" })
        } as Response)

        fireEvent.submit(form)
        expect(await screen.findByText("Erro ao buscar os horários disponíveis")).toBeInTheDocument()

        // 3 - Cenário de sucesso
        const schedulesMock = [
            { start: "09:00", end: "09:30" },
            { start: "10:00", end: "10:30" }
        ]

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => schedulesMock
        } as Response)

        fireEvent.submit(form)

        expect(await screen.findByText("ScheduleList")).toBeInTheDocument()

        mockFetch.mockRestore()
    })

    it("deve executar handleSelectSchedule ao selecionar um horário", async () => {
        // Mock do ScheduleList para simular a seleção de horário
        (ScheduleList as jest.Mock).mockImplementation(({ onSelectSchedule }) => (
            <div>
                <button onClick={() => onSelectSchedule({ start: "2025-09-10T09:00:00", end: "2025-09-10T09:30:00" })}>
                    Selecionar horário 09:00
                </button>
            </div>
        ))

        // Mock do fetch para retornar horários disponíveis
        const mockFetch = jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
            ok: true,
            json: async () => [{ start: "2025-09-10T09:00:00", end: "2025-09-10T09:30:00" }]
        } as Response)

        render(<SelectScheduled />)

        // Preenche a data e busca horários
        const input = screen.getByTestId("date-input")
        fireEvent.change(input, { target: { value: "2025-09-10" } })

        const form = screen.getByTestId("schedule-form")
        fireEvent.submit(form)

        // Aguarda o ScheduleList aparecer e seleciona um horário
        const selectButton = await screen.findByText("Selecionar horário 09:00")
        fireEvent.click(selectButton)

        // Verifica se a dispatch foi chamada corretamente
        expect(dispatchMock).toHaveBeenCalledWith({
            type: "SET_SCHEDULE",
            payload: {
                scheduledAt: "2025-09-10T09:00:00",
                endsAt: "2025-09-10T09:30:00"
            }
        })

        mockFetch.mockRestore()
    })

    it("deve habilitar o botão Próximo apenas quando state.scheduledAt não for nulo", () => {
        // Cenário 1: Sem horário selecionado
        (useAppointmentContext as jest.Mock).mockReturnValue({
            state: {
                scheduledAt: null,
                endsAt: null,
                durationMinutes: 30,
                dentistId: "1"
            },
            dispatch: dispatchMock
        })

        const { rerender } = render(<SelectScheduled />)

        const nextButton = screen.getByText("Próximo").closest("button")
        expect(nextButton).toBeDisabled()

            // Cenário 2: Com horário selecionado
            ; (useAppointmentContext as jest.Mock).mockReturnValue({
                state: {
                    scheduledAt: "2025-09-10T09:00:00",
                    endsAt: "2025-09-10T09:30:00",
                    durationMinutes: 30,
                    dentistId: "1"
                },
                dispatch: dispatchMock
            })

        rerender(<SelectScheduled />)

        const enabledNextButton = screen.getByText("Próximo").closest("button")
        expect(enabledNextButton).not.toBeDisabled()
    })
})