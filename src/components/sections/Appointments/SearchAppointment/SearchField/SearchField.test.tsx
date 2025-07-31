import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import SearchField from "."
import userEvent from "@testing-library/user-event"

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

    it("atualiza o campo CPF corretamente ao digitar", async () => {
        render(
            <SearchField 
                appointmentsFound={mockAppointmentsFound}
                visible={true}
            />
        )

        const input = screen.getByLabelText("CPF")

        await userEvent.type(input, "12345678900")

        expect(input).toHaveValue("123.456.789-00")
    })
})