import { useAppointmentContext } from "@/contexts/NewAppointmentContext"
import useSWR from "swr"
import SelectProcedure from "."
import { fireEvent, render, screen } from "@testing-library/react"

// Mock do contexto
jest.mock("@/contexts/NewAppointmentContext", () => ({
    useAppointmentContext: jest.fn()
}))

// Mock do useSWR
jest.mock("swr")

describe("SelectProcedure", () => {
    const dispatchMock = jest.fn()
    const proceduresMock = [
        { id: 1, procedure: "Limpeza", durationMinutes: 30 },
        { id: 2, procedure: "Restauração", durationMinutes: 60 }
    ]

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppointmentContext as jest.Mock).mockReturnValue({
            state: { procedure: "" },
            dispatch: dispatchMock
        });

        (useSWR as jest.Mock).mockReturnValue({
            data: proceduresMock,
            error: null,
            isLoading: false
        })
    })

    it("deve renderizar corretamente e mostrar os procedimentos no select (snapshot)", () => {
        const { container } = render(<SelectProcedure />)

        const select = screen.getByLabelText("Escolha o Procedimento") as HTMLSelectElement
        expect(select).toBeInTheDocument()
        expect(select.value).toBe("") // valor inicial
        expect(screen.getByText("Selecione um procedimento")).toBeInTheDocument()
        expect(screen.getByText("Limpeza")).toBeInTheDocument()
        expect(screen.getByText("Restauração")).toBeInTheDocument()

        expect(container).toMatchSnapshot()
    })

    it("deve disparar dispatch correto ao clicar em 'Voltar'", () => {
        render(<SelectProcedure />)
        const backButton = screen.getByText("Voltar")
        fireEvent.click(backButton)

        expect(dispatchMock).toHaveBeenCalledWith({ type: "SET_STEP", payload: 2 })
    })

    it("deve disparar dispatch correto ao selecionar um procedimento", () => {
        render(<SelectProcedure />)

        const select = screen.getByLabelText("Escolha o Procedimento") as HTMLSelectElement
        fireEvent.change(select, { target: { value: "Restauração" } })

        expect(dispatchMock).toHaveBeenCalledWith({
            type: "SET_PROCEDURE",
            payload: { procedure: "Restauração", durationMinutes: 60 }
        })
    })

    it("deve exibir o Spinner quando isLoading for true", () => {
        // Mock específico para este teste
        (useSWR as jest.Mock).mockReturnValueOnce({
            data: null,
            error: null,
            isLoading: true
        })

        render(<SelectProcedure />)
        const spinner = screen.getByTestId("spinner")
        expect(spinner).toBeInTheDocument()
    })

    it("deve exibir FeedbackMessage quando houver erro", () => {
        const errorMessage = "Erro ao buscar procedimentos"

        // Mock específico para este teste
        ;(useSWR as jest.Mock).mockReturnValue({
            data: null,
            error: errorMessage,
            isLoading: false
        })
        
        render(<SelectProcedure />)

        const feedback = screen.getByText(errorMessage)
        expect(feedback).toBeInTheDocument()
    })
})