import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import SearchField from "."

describe("SearchField", () => {
    const mockAppointmentsFound = jest.fn()
    // Testes de renderização
    it("renderiza a mensagem inicial corretamente", () => {
        render(
            <SearchField 
                appointmentsFound={mockAppointmentsFound}
                visible={false}
            />
        )

        // Verifica se a mensagem inicial está visível
        expect(
            screen.getByText("Digite um CPF e clique em Buscar para encontrar consultas...")
        ).toBeInTheDocument()

        // O ícone Info também deve estar presente na mensagem inicial
        expect(screen.getByTestId("info-icon")).toBeInTheDocument()
    })

    it("não aplica a classe visible quando visible é false", () => {
        const { container } = render(
            <SearchField 
                appointmentsFound={mockAppointmentsFound}
                visible={false}
            />
        )

        expect(container.firstChild).not.toHaveClass("visible")
    })

    it("aplica a classe visible quando visible é true", () => {
        const { container } = render(
            <SearchField 
                appointmentsFound={mockAppointmentsFound}
                visible={true}
            />
        )

        expect(container.firstChild).toHaveClass("visible")
    })
})