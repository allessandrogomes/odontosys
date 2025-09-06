import useSWR from "swr"
import SelectDentist from "."
import { fireEvent, render, screen } from "@testing-library/react"
import { useAppointmentContext } from "@/contexts/NewAppointmentContext"


// Mock do contexto
jest.mock("@/contexts/NewAppointmentContext", () => ({
    useAppointmentContext: jest.fn().mockReturnValue({
        state: { procedure: "Limpeza", dentistId: null, dentistName: "" },
        dispatch: jest.fn()
    })
}))

// Mock do SWR
jest.mock("swr", () => ({
    __esModule: true,
    default: jest.fn()
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

describe("SelectDentist", () => {
    // Mock global do dispatch
    const dispatchMock = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks(); // Reseta todos os mocks antes de cada novo it

        // Mock do SWR
        (useSWR as jest.Mock).mockReturnValue({ data: [], error: null, isLoading: false })
    })

    it("deve renderizar o componente inicial", () => {
        const { container } = render(<SelectDentist />)
        expect(container).toMatchSnapshot()
    })

    it("deve exibir os dentistas retornados pelo useSWR", () => {
        const dentistMock = [
            { id: "1", name: "João" },
            { id: "2", name: "Maria" }
        ]

            ; (useSWR as jest.Mock).mockReturnValue({ data: dentistMock, error: null, isLoading: false })

        render(<SelectDentist />)

        expect(screen.getByText("Dr. João")).toBeInTheDocument()
        expect(screen.getByText("Dr. Maria")).toBeInTheDocument()
    })

    it("deve mostrar o spinner quando isLoading for true", () => {
        ; (useSWR as jest.Mock).mockReturnValue({ data: [], error: null, isLoading: true })

        const { getByText } = render(<SelectDentist />)

        expect(getByText("Spinner")).toBeInTheDocument()
    })

    it("deve mostrar a mensagem de erro quando error estiver presente", () => {
        ;(useSWR as jest.Mock).mockReturnValue({ data: undefined, error: "Erro inesperado", isLoading: false })

        const { getByText } = render(<SelectDentist />)

        expect(getByText("Erro inesperado")).toBeInTheDocument()
    })

    it("deve armazenar o dentista selecionado no state e habilitar o botão Próximo", () => {
        const dentistMock = [
            { id: 1, name: "João" },
            { id: 2, name: "Maria" }
        ]

        // Contexto inicial sem dentista selecionado
        ;(useAppointmentContext as jest.Mock).mockReturnValue({
            state: { procedure: "Limpeza", dentistId: null, dentistName: null },
            dispatch: dispatchMock
        })

        ;(useSWR as jest.Mock).mockReturnValue({ data: dentistMock, error: null, isLoading: false })

        const { getByLabelText, rerender, getByText } = render(<SelectDentist />)
        
        // Clica no dentista João
        const selectJoao = getByLabelText("Selecionar dentista João")
        selectJoao.click()

        expect(dispatchMock).toHaveBeenCalledWith({
            type: "SET_DENTIST",
            payload: { id: 1, name: "João" }
        })

        // Atualiza o estado simulando que o dentista foi salvo no context
        ;(useAppointmentContext as jest.Mock).mockReturnValue({
            state: { procedure: "Limpeza", dentistId: 1, dentistName: "João" },
            dispatch: dispatchMock
        })

        rerender(<SelectDentist />)

        // Agora o botão Próximo deve estar habilitado
        const nextButton = getByText("Próximo") as HTMLButtonElement
        expect(nextButton).not.toBeDisabled()
    })

    it("deve executar dispatch ao clicar em Voltar e Próximo", () => {
        render(<SelectDentist />)

        const backButton = screen.getByText("Voltar")
        const nextButton = screen.getByText("Próximo")

        // Simula o clique no botão Voltar
        fireEvent.click(backButton)
        expect(dispatchMock).toHaveBeenCalledWith({ type: "SET_STEP", payload: 3 })
        expect(dispatchMock).toHaveBeenCalledWith({
            type: "SET_DENTIST",
            payload: { id: null, name: null }
        })

        // Simula o clique no botão Próximo
        fireEvent.click(nextButton)
        expect(dispatchMock).toHaveBeenCalledWith({ type: "SET_STEP", payload: 5 })
    })
})
