import { useAppointmentContext } from "@/contexts/NewAppointmentContext"
import { render, screen } from "@testing-library/react"
import React from "react"
import SearchPatient from "."

// Mock do contexto
jest.mock("@/contexts/NewAppointmentContext", () => ({
    useAppointmentContext: jest.fn()
}))

// Mock dos subcomponentes para evitar renderizaç~ões complexas
jest.mock("@/components/forms/PatientDetailsForm", () => ({
    __esModule: true,
    default: jest.fn(({ onResult, callType }) => (
        <div data-testid="patient-form">
            callType: {callType} | onResult: {onResult ? "ok" : "null"}
        </div>
    ))
}))

jest.mock("@/components/ui/FeedbackMessage", () => ({
    __esModule: true,
    default: jest.fn(({ message }) => <div data-testid="feedback-message">Mocked FeedbackMessage: {message}</div>)
}))

describe("SearchPatient", () => {
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

    it ("deve renderizar PatientDetailsForm com props corretas", () => {
        render(<SearchPatient />)

        const form = screen.getByTestId("patient-form")
        expect(form).toBeInTheDocument()
        expect(form.textContent).toContain("callType: patient")
        expect(form.textContent).toContain("onResult: ok")
    })

    it ("deve renderizar FeedbackMessage somente quando feedbackMessage está definido", () => {
        // Spy para simular feedbackMessage
        const useStateSpy = jest.spyOn(React, "useState")
        useStateSpy.mockImplementation(() => ["Mensagem de teste", jest.fn()])

        render(<SearchPatient />)

        const feedback = screen.getByTestId("feedback-message")
        expect(feedback).toBeInTheDocument()
        expect(feedback.textContent).toContain("Mensagem de teste")

        useStateSpy.mockRestore()
    })
})