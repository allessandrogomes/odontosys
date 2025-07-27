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
})