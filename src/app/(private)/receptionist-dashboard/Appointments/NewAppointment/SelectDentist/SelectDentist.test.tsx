import useSWR from "swr"
import SelectDentist from "."
import { render, screen } from "@testing-library/react"
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
    default: jest.fn(({ text, ...props }) => <button {...props}>{text}</button>)
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
    beforeEach(() => {
        jest.clearAllMocks(); // limpa antes de configurar

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

        const dispatchMock = jest.fn()
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
})
