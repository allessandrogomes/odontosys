import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ModalConfirmation from "."

const mockAppointment = {
    id: 1,
    scheduledAt: "2025-07-26T14:00:00.000Z",
    endsAt: "2025-07-26T15:00:00.000Z",
    procedure: "Limpeza",
    patient: { name: "João da Silva" }
}

describe("ModalConfirmation", () => {
    // Testes de renderização
    it("renderiza corretamente o título quando type é 'FINISH'", () => {
        render(
            <ModalConfirmation 
                type="FINISH"
                appointment={mockAppointment}
                onCancel={jest.fn()}
                onConfirm={jest.fn()}
            />
        )

        expect(screen.getByRole("heading", { name: /Deseja Finalizar essa consulta\?/i })).toBeInTheDocument()
    })

    it("renderiza corretamente o título quando type é 'CANCEL'", () => {
        render(
            <ModalConfirmation 
                type="CANCEL"
                appointment={mockAppointment}
                onCancel={jest.fn()}
                onConfirm={jest.fn()}
            />
        )

        expect(screen.getByRole("heading", { name: /Deseja Cancelar essa consulta\?/i })).toBeInTheDocument()
    })

    it("renderiza nome do paciente, procedimento e horário formatado", () => {
        render(
            <ModalConfirmation 
                type="FINISH"
                appointment={mockAppointment}
                onCancel={jest.fn()}
                onConfirm={jest.fn()}
            />
        )

        expect(screen.getByText(/João da Silva/i)).toBeInTheDocument()
        expect(screen.getByText(/Limpeza/i)).toBeInTheDocument()
        expect(screen.getByText("11:00 - 12:00")).toBeInTheDocument() // assumindo UTC-3
    })
})