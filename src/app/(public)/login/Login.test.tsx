import { render, screen, waitFor } from "@testing-library/react"
import Login from "./page"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"

const mockPush = jest.fn()

// Mocka o useRouter da App Router
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush
    })
}))

// Mock global do fetch com delay para manter o loading visível
global.fetch = jest.fn(() =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ok: true,
                json: async () => ({ user: { role: "RECEPCIONISTA" } })
            })
        }, 100) // pequeno delay
    })
) as jest.Mock

describe("Login Page", () => {
    //Testes de renderização
    it("deve renderizar os campos de CPF e senha", () => {
        render(<Login />)

        expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    })

    it("deve renderizar o botão de 'Entrar'", () => {
        render(<Login />)

        const button = screen.getByRole("button", { name: /entrar/i })
        expect(button).toBeInTheDocument()
    })

    it("deve renderizar a logo", () => {
        render(<Login />)

        const logo = screen.getByAltText("Logo OdontoSys")
        expect(logo).toBeInTheDocument()
    })

    //Testes de comportamento do formulário
    it("deve permitir digitar no campo de CPF com máscara aplicada", async () => {
        render(<Login />)

        const cpfInput = screen.getByLabelText(/cpf/i)
        await userEvent.type(cpfInput, "12345678901")

        expect(cpfInput).toHaveValue("123.456.789-01")
    })

    it("deve permitir digitar no campo de senha", async () => {
        render(<Login />)

        const passwordInput = screen.getByLabelText(/senha/i)
        await userEvent.type(passwordInput, "Teste123*")

        expect(passwordInput).toHaveValue("Teste123*")
    })

    it("deve exibir o spinner durante o carregamento", async () => {
        render(<Login />)

        const cpfInput = screen.getByLabelText(/cpf/i)
        const passwordInput = screen.getByLabelText(/senha/i)
        const button = screen.getByRole("button", { name: /entrar/i })

        await userEvent.type(cpfInput, "87590814333")
        await userEvent.type(passwordInput, "Teste123*")
        await userEvent.click(button)

        // O botão desaparece e o Spinner é exibido
        expect(screen.queryByRole("button", { name: /entrar/i })).not.toBeInTheDocument()
        expect(screen.getByTestId("spinner")).toBeInTheDocument()
    })

    //Testes de envio de formulário
    it("deve chamar a API /api/login com os dados corretos ao submeter", async () => {
        const mockFetch = jest.fn(() => 
            Promise.resolve({
                ok: true,
                json: async () => ({ user: { role: "RECEPCIONISTA" } })
            })
        )
        global.fetch = mockFetch as jest.Mock

        render(<Login />)

        const cpfInput = screen.getByLabelText(/cpf/i)
        const passwordInput = screen.getByLabelText(/senha/i)
        const submitButton = screen.getByRole("button", { name: /entrar/i })

        await userEvent.type(cpfInput, "87590814333")
        await userEvent.type(passwordInput, "Teste123*")
        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith("/api/login", expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cpf: "875.908.143-33",
                    password: "Teste123*"
                })
            }))
        })
    })

    it("deve redirecionar para /dentist-dashboard se a role for DENTISTA", async () => {
        global.fetch = jest.fn(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ user: { role: "DENTISTA" } })
            })
        ) as jest.Mock

        render(<Login />)

        await userEvent.type(screen.getByLabelText(/cpf/i), "87590814333")
        await userEvent.type(screen.getByLabelText(/senha/i), "Teste123*")
        await userEvent.click(screen.getByRole("button", { name: /entrar/i }))

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/dentist-dashboard")
        })
    })

    it("deve redirecionar para /receptionist-dashboard se a role for RECEPCIONISTA", async () => {
        global.fetch = jest.fn(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ user: { role: "RECEPCIONISTA" } })
            })
        ) as jest.Mock

        render(<Login />)

        await userEvent.type(screen.getByLabelText(/cpf/i), "87590814333'")
        await userEvent.type(screen.getByLabelText(/senha/i), "Teste123*")
        await userEvent.click(screen.getByRole("button", { name: /entrar/i }))

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/receptionist-dashboard")
        })
    })

    it("deve exibir mensagem de erro se a API retornar erro", async () => {
        global.fetch = jest.fn(() => 
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: "Credenciais inválidas" })
            })
        ) as jest.Mock

        render (<Login />)

        await userEvent.type(screen.getByLabelText(/cpf/i), "87590814333")
        await userEvent.type(screen.getByLabelText(/senha/i), "Teste123*")
        await userEvent.click(screen.getByRole("button", { name: /entrar/i }))

        await waitFor(() => {
            expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument()
        })
    })
})