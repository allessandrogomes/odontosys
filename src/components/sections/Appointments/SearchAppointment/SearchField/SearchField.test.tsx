import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import SearchField from "."
import userEvent from "@testing-library/user-event"
import * as getAppointments from "@/services/appointments/getAppointmentsByCPF"

jest.mock("@/services/appointments/getAppointmentsByCPF", () => ({
    getAppointmentsByCPF: jest.fn()
}))

const mockAppointmentsFound = jest.fn()

describe("SearchField", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getAppointments.getAppointmentsByCPF as jest.Mock).mockResolvedValue([])
    })

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

    it("não chama a API quando o mesmo CPF é submetido consecutivamente", async () => {
        const user = userEvent.setup()
        render(<SearchField appointmentsFound={mockAppointmentsFound} visible={true} />)

        // Localiza os elementos
        const cpfInput = screen.getByLabelText("CPF do Paciente:")
        const submitButton = screen.getByRole("button", { name: /buscar/i })

        // Preenche o campo CPF e clica no botão
        await user.type(cpfInput, "12345678900")
        await user.click(submitButton)

        // Aguarda a chamada da API
        await waitFor(() => {
            expect(getAppointments.getAppointmentsByCPF).toHaveBeenCalledTimes(1)
            expect(getAppointments.getAppointmentsByCPF).toHaveBeenCalledWith("123.456.789-00")
        })

        // Submete novamente o mesmo CPF
        await user.click(submitButton)

        // Verifica que a API não foi chamada novamente
        await waitFor(() => {
            expect(getAppointments.getAppointmentsByCPF).toHaveBeenCalledTimes(1)
        })
    })

    // Testes de estados de carregamento e mensagens
    it("deve exibir o spinner durante a busca e remover após a conclusão", async () => {
        // Configura o mock para simular um atraso na resposta da API
        (getAppointments.getAppointmentsByCPF as jest.Mock).mockImplementation(() =>
            new Promise((resolve) => setTimeout(() => resolve([]), 100))
        )

        const user = userEvent.setup()
        render(<SearchField appointmentsFound={mockAppointmentsFound} visible={true} />)

        // Preenche e submete o formulário
        await user.type(screen.getByLabelText("CPF do Paciente:"), "12345678900")
        await user.click(screen.getByRole("button", { name: /buscar/i }))

        // Verifica se o spinner está visível durante a busca
        expect(screen.getByTestId("spinner")).toBeInTheDocument()

        // Aguarda a conclusão da busca e verifica se o spinner foi removido
        await waitFor(() => {
            expect(screen.queryByTestId("spinner")).not.toBeInTheDocument()
        })
    })

    it("deve chamar appointmentsFound com os dados retornados da API quando houver resultados", async () => {
        const mockData = [
            { id: 1, patientName: "João Silva", date: "2023-10-01" },
            { id: 2, patientName: "Leticia Ferreira", date: "2023-10-02" }
        ];
        (getAppointments.getAppointmentsByCPF as jest.Mock).mockResolvedValue(mockData)

        const user = userEvent.setup()
        render(<SearchField appointmentsFound={mockAppointmentsFound} visible={true} />)

        // Preenche o campo CPF e clica no botão
        await user.type(screen.getByLabelText("CPF do Paciente:"), "12345678900")
        await user.click(screen.getByRole("button", { name: /buscar/i }))

        // Verifica se a função appointmentsFound foi chamada com os dados corretos
        await waitFor(() => {
            expect(mockAppointmentsFound).toHaveBeenCalledWith(mockData)
            expect(screen.queryByText("Nenhuma consulta encontrada")).not.toBeInTheDocument()
            expect(screen.queryByTestId("info-icon")).not.toBeInTheDocument()
        })
    })
})