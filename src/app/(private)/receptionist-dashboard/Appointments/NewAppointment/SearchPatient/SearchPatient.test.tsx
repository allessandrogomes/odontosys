import { useAppointmentContext } from "@/contexts/NewAppointmentContext"
import { render, screen } from "@testing-library/react"
import React from "react"
import SearchPatient from "."


// Variável para capturar onResult
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockOnResult: ((result: any) => void) | null = null

// Mock do contexto
jest.mock("@/contexts/NewAppointmentContext", () => ({
    useAppointmentContext: jest.fn()
}))

// Mock dos subcomponentes para evitar renderizaç~ões complexas
jest.mock("@/components/forms/PatientDetailsForm", () => ({
    __esModule: true,
    default: jest.fn(({ onResult, callType }) => {
        mockOnResult = onResult // capturamos aqui
        return (
            <div data-testid="patient-form">
                callType: {callType} | onResult: {onResult ? "ok" : "null"}
            </div>
        )
    })
}))

jest.mock("@/components/ui/FeedbackMessage", () => ({
    __esModule: true,
    default: jest.fn(({ message }) => <div data-testid="feedback-message">Mocked FeedbackMessage: {message}</div>)
}))

describe("SearchPatient", () => {
    const dispatchMock = jest.fn()
    const setFeedbackMessageMock = jest.fn()

    beforeEach(() => {
        (useAppointmentContext as jest.Mock).mockReturnValue({
            dispatch: dispatchMock
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jest.spyOn(React, "useState").mockImplementation(() => ["", setFeedbackMessageMock] as [any, React.Dispatch<any>])

        jest.clearAllMocks()
        mockOnResult = null
    })

    it("deve renderizar corretamente sem feedbackMessage", () => {
        const { container } = render(<SearchPatient />)
        expect(container).toMatchSnapshot()
    })

    it("deve renderizar corretamente quando há feedbackMessage", () => {
        // Para simular o feedbackMessage, podemos "forçar" o estado inicial
        const useStateSpy = jest.spyOn(React, "useState")
        useStateSpy.mockImplementation(() => ["Mensagem de teste", jest.fn()])

        const { container } = render(<SearchPatient />)
        expect(container).toMatchSnapshot()

        useStateSpy.mockRestore()
    })

    it("deve renderizar PatientDetailsForm com props corretas", () => {
        render(<SearchPatient />)

        const form = screen.getByTestId("patient-form")
        expect(form).toBeInTheDocument()
        expect(form.textContent).toContain("callType: patient")
        expect(form.textContent).toContain("onResult: ok")
    })

    it("deve renderizar FeedbackMessage somente quando feedbackMessage está definido", () => {
        // Spy para simular feedbackMessage
        const useStateSpy = jest.spyOn(React, "useState")
        useStateSpy.mockImplementation(() => ["Mensagem de teste", jest.fn()])

        render(<SearchPatient />)

        const feedback = screen.getByTestId("feedback-message")
        expect(feedback).toBeInTheDocument()
        expect(feedback.textContent).toContain("Mensagem de teste")

        useStateSpy.mockRestore()
    })

    function getHandleResult() {
        render(<SearchPatient />)
        if (!mockOnResult) throw new Error("onResult não foi capturado")
        return mockOnResult
    }

    it("deve despachar SET_PATIENT, SET_STEP e limpar feedbackMessage quando type = 'patient'", () => {
        const handleResult = getHandleResult()

        handleResult({
            type: "patient",
            patient: { id: 1, name: "Fulano" }
        })

        expect(dispatchMock).toHaveBeenCalledWith({
            type: "SET_PATIENT",
            payload: { id: 1, name: "Fulano" }
        })

        expect(dispatchMock).toHaveBeenCalledWith({
            type: "SET_STEP",
            payload: expect.anything()
        })
        expect(setFeedbackMessageMock).toHaveBeenCalledWith(null)
    })

    it("deve atualizar feedbackMessage quando type = 'message'", () => {
        const handleResult = getHandleResult()

        handleResult({
            type: "message",
            message: "Paciente não encontrado"
        })

        expect(setFeedbackMessageMock).toHaveBeenCalledWith("Paciente não encontrado")
    })

     it("deve atualizar feedbackMessage com 'Erro inesperado' para caso default", () => {
        const handleResult = getHandleResult()

        handleResult({
            type: "desconhecido",
            foo: "bar"
        })

        expect(setFeedbackMessageMock).toHaveBeenCalledWith("Erro inesperado")
    })
})