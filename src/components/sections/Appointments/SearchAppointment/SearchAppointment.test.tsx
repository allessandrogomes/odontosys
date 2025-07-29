import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import SearchAppointment from "."
import userEvent from "@testing-library/user-event"

// Mock do componente SearchField
jest.mock("@/components/sections/Appointments/SearchAppointment/SearchField", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MockSearchField = (props: { appointmentsFound: (a: any[]) => void }) => {
        return (
            <button
                data-testid="search-field"
                onClick={() => props.appointmentsFound([{ id: 1, patientName: "Teste" }])}
            >
                SearchField
            </button>
        )
    }
    MockSearchField.displayName = "MockSearchField"
    return MockSearchField
})

// Mock do AppointmentsFound
jest.mock("@/components/sections/Appointments/SearchAppointment/AppointmentsFound", () => {
    return function MockAppointmentsFound() {
        return <div data-testid="appointments-found">AppointmentsFound</div>
    }
})

describe("SearchAppointment", () => {
    // Testes de renderização
    it("deve exibir o título 'Buscar Consulta'", () => {
        render(<SearchAppointment />)
        const title = screen.getByText(/buscar consulta/i)
        expect(title).toBeInTheDocument()
    })

    it("deve exibir o componente SearchField inicialmente", () => {
        render(<SearchAppointment />)
        const searchField = screen.getByTestId("search-field")
        expect(searchField).toBeInTheDocument()
    })

    // Testes de interação
    it("deve mostrar o componente AppointmentsFound ao receber resultados do SearchField", async () => {
        render(<SearchAppointment />)

        const button = screen.getByTestId("search-field")
        // Simula clique para disparar o callback que preenche appointments
        await act(async () => {
            await userEvent.click(button)
        })

        // Verifica se o AppointmentFound aparece
        const appointmentsFound = screen.getByTestId("appointments-found")
        expect(appointmentsFound).toBeInTheDocument()
    })
})