import useSWR from "swr"
import SelectDentist from "."
import { render } from "@testing-library/react"


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
})
