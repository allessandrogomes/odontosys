import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import SearchAppointment from "."

// Mock do componente SearchField
jest.mock("@/components/sections/Appointments/SearchAppointment/SearchField", () => {
    const MockSearchField = () => <div data-testid="search-field">SearchField</div>
    MockSearchField.displayName = "MockSearchField"
    return MockSearchField
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
})