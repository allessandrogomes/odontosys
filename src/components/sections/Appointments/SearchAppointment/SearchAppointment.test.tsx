import { render, screen } from "@testing-library/react"
import SearchAppointment from "."

describe("SearchAppointment", () => {
    // Testes de renderização
    it("deve exibir o título 'Buscar Consulta'", () => {
        render(<SearchAppointment />)
        const title = screen.getByText(/buscar consulta/i)
        expect(title).toBeInTheDocument()
    })
})