import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import Resume from "."

// Mock global.fetch para evitar chamadas reais no useEffect

beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]) // Retorna um array vazio de appointments
        })
    ) as jest.Mock
})

describe("Dashboard do Recepcionista - Resume", () => {
    // Testes de renderização
    it("deve exibir os títulos 'Dentista' e 'Consultas' e o botão 'Atualizar'", async () => {
        render(<Resume />)

        await waitFor(() => {
            expect(screen.getByRole("heading", { name: /dentista/i })).toBeInTheDocument()
            expect(screen.getByRole("heading", { name: /consultas/i })).toBeInTheDocument()
            expect(screen.getByRole("button", { name: /atualizar/i })).toBeInTheDocument()
        })
    })

    // Testes de Estados Iniciais
    it("deve mostrar o texto 'Carregando' e o spinner enquanto isLoading for true", async () => {
        // Simula fetch pendente para manter o isLoading
        global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock

        render(<Resume />)

        expect(screen.getByText(/Carregando/i)).toBeInTheDocument()
        expect(screen.getByTestId("spinner")).toBeInTheDocument()
    })
})