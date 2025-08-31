import { useAppointmentContext } from "@/contexts/NewAppointmentContext"
import { render } from "@testing-library/react"
import React from "react"
import SearchPatient from "."

// Mock do contexto
jest.mock("@/contexts/NewAppointmentContext", () => ({
    useAppointmentContext: jest.fn()
}))

// Mock dos subcomponentes para evitar renderizaç~ões complexas
jest.mock("@/components/forms/PatientDetailsForm", () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked PatientDetailsForm</div>)
}))

jest.mock("@/components/ui/FeedbackMessage", () => ({
    __esModule: true,
    default: jest.fn(({ message }) => <div>Mocked FeedbackMessage: {message}</div>)
}))

describe("SearchPatient - Renderização", () => {
    const dispatchMock = jest.fn()

    beforeEach(() => {
        (useAppointmentContext as jest.Mock).mockReturnValue({
            dispatch: dispatchMock
        })
        jest.clearAllMocks()
    })

    it ("deve renderizar corretamente sem feedbackMessage", () => {
        const { container } = render(<SearchPatient />)
        expect(container).toMatchSnapshot()
    })

    it ("deve renderizar corretamente quando há feedbackMessage", () => {
        // Para simular o feedbackMessage, podemos "forçar" o estado inicial
        const useStateSpy = jest.spyOn(React, "useState")
        useStateSpy.mockImplementation(() => ["Mensagem de teste", jest.fn()])

        const { container } = render(<SearchPatient />)
        expect(container).toMatchSnapshot()

        useStateSpy.mockRestore()
    })
})