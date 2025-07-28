import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import DentistCard from "."

describe("DentistCard", () => {
    // Testes de renderização
    it("renderiza corretamente o nome do dentista com prefixo 'Dr.'", () => {
        render(<DentistCard dentistName="João Mendes" />)

        expect(screen.getByText("Dr. João Mendes")).toBeInTheDocument()
    })

    it("renderiza os elementos visuais esperados", () => {
        const { container } = render(<DentistCard dentistName="João Mendes"/>)

        expect(container.querySelector(".card")).toBeInTheDocument()
        expect(container.querySelector(".icon")).toBeInTheDocument()
        expect(container.querySelector(".divisory")).toBeInTheDocument()
    })

    // Testes visuais (classe CSS)
    it("possui a classe CSS 'card' aplicada ao container principal", () => {
        const { container } = render(<DentistCard dentistName="João Mendes"/>)

        const mainDiv = container.firstChild as HTMLElement
        expect(mainDiv).toHaveClass("card")
    })
})