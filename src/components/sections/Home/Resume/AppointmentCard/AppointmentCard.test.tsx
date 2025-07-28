import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import AppointmentCard from "."

describe("AppointmentCard", () => {
    // Testes de renderização
    it("renderiza apenas o primeiro e último nome do paciente", () => {
        render(
            <AppointmentCard
                patientName="João da Silva Costa"
                procedure="Limpeza"
                start="2025-07-26T14:00:00.000Z"
                end="2025-07-26T15:00:00.000Z"
                onClickFinish={jest.fn()}
                onClickCancel={jest.fn()}
            />
        )

        // Verifica que apenas "João Costa" aparece no texto
        expect(screen.getByText(/João Costa/i)).toBeInTheDocument()
        // Garante que "da Silva" não aparece
        expect(screen.queryByText(/da Silva/i)).not.toBeInTheDocument()
    })

    it("exibe corretamente o nome do procedimento", () => {
        render(
            <AppointmentCard
                patientName="João da Silva Costa"
                procedure="Limpeza"
                start="2025-07-26T14:00:00.000Z"
                end="2025-07-26T15:00:00.000Z"
                onClickFinish={jest.fn()}
                onClickCancel={jest.fn()}
            />
        )

        expect(screen.getByText(/Limpeza/i)).toBeInTheDocument()
    })

    it("mostra corretamente os horários formatados", () => {
        render(
            <AppointmentCard
                patientName="João da Silva Costa"
                procedure="Limpeza"
                start="2025-07-26T14:00:00.000Z"
                end="2025-07-26T15:00:00.000Z"
                onClickFinish={jest.fn()}
                onClickCancel={jest.fn()}
            />
        )

        expect(screen.getByText(/11:00 - 12:00/i)).toBeInTheDocument()
    })

    it("aplica a classe 'lastCard' quando isLast é true", () => {
        const { container } = render(
            <AppointmentCard
                patientName="Ana Souza"
                procedure="Consulta"
                start="2025-07-26T10:00:00.000Z"
                end="2025-07-26T11:00:00.000Z"
                onClickFinish={jest.fn()}
                onClickCancel={jest.fn()}
                isLast={true}
            />
        )

        const card = container.querySelector("[data-testid='appointment-card']")

        expect(card?.className).toMatch(/lastCard/)
    })

    it("chama onClickFinish ao clicar no botão de check", async () => {
        const onClickFinish = jest.fn()

        render(
            <AppointmentCard
                patientName="Carlos Lima"
                procedure="Avaliação"
                start="2025-07-26T08:00:00.000Z"
                end="2025-07-26T09:00:00.000Z"
                onClickFinish={onClickFinish}
                onClickCancel={jest.fn()}
            />
        )

        const checkButton = screen.getByTitle(/conclusão da consulta/i)
        await userEvent.click(checkButton)

        expect(onClickFinish).toHaveBeenCalledTimes(1)
    })
})