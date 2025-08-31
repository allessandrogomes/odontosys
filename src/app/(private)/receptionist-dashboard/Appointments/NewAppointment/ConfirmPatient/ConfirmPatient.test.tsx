import { useAppointmentContext } from "@/contexts/NewAppointmentContext"
import { fireEvent, render, screen } from "@testing-library/react"
import ConfirmPatient from "."


jest.mock("@/contexts/NewAppointmentContext", () => ({
    useAppointmentContext: jest.fn()
}))

describe("ConfirmPatient", () => {
    const dispatchMock = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppointmentContext as jest.Mock).mockReturnValue({
            state: { patientName: "Fulano da Silva" },
            dispatch: dispatchMock
        })
    })

    it("deve renderizar corretamente mostrando o nome do paciente (snapshot)", () => {
        const { container } = render(<ConfirmPatient />)
        expect(container).toMatchSnapshot()
    })

    it("deve disparar dispatch correto ao clicar em 'Voltar'", () => {
        render(<ConfirmPatient />)
        const backButton = screen.getByText("Voltar")
        fireEvent.click(backButton)

        expect(dispatchMock).toHaveBeenCalledWith({ type: "SET_STEP", payload: 1 })
        expect(dispatchMock).toHaveBeenCalledWith({ type: "SET_PATIENT", payload: { id: null, name: "" } })
    })

    it("deve disparar dispatch correto ao clicar em 'Próximo'", () => {
        render(<ConfirmPatient />)
        const nextButton = screen.getByText("Próximo")
        fireEvent.click(nextButton)

        expect(dispatchMock).toHaveBeenCalledWith({ type: "SET_STEP", payload: 3 })
    })
})