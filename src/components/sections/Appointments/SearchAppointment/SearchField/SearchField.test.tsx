import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import SearchField from "."
import userEvent from "@testing-library/user-event"
import * as getAppointments from "@/services/appointments/getAppointmentsByCPF"

jest.mock("@/services/appointments/getAppointmentsByCPF")

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

    // Testes de interação
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

    it("chama handleSearchAppointmentsByCPF ao submeter o formulário", async () => {
        const mockGetAppointments = getAppointments.getAppointmentsByCPF as jest.Mock
        mockGetAppointments.mockResolvedValue([])

        render(
            <SearchField 
                appointmentsFound={mockAppointmentsFound}
                visible={true}
            />
        )

        const input = screen.getByRole("textbox")
        const button = screen.getByRole("button", { name: /buscar/i })

        await userEvent.type(input, "12345678900")
        await userEvent.click(button)

        // Aguarda até que o mock da API tenha sido chamado
        await waitFor(() => {
            expect(mockGetAppointments).toHaveBeenCalledWith("123.456.789-00")
            expect(mockAppointmentsFound).toHaveBeenCalledWith([]) // chamado no início da função
        })
    })
})