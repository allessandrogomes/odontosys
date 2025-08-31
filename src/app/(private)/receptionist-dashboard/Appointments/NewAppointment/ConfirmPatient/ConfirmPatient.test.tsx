import { useAppointmentContext } from "@/contexts/NewAppointmentContext"
import { render } from "@testing-library/react"
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
})