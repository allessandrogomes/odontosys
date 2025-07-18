import { render, screen } from "@testing-library/react"
import Login from "./page"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"

// Mocka o useRouter da App Router
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn()
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
})