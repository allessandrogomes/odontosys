import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ModalConfirmation from "."
import userEvent from "@testing-library/user-event"

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

    // Testes de interação
    it("chama onConfirm('FINISH') ao clicar no botão 'Finalizar'", async () => {
        const onConfirm = jest.fn()
        const user = userEvent.setup()

        render(
            <ModalConfirmation
                type="FINISH"
                appointment={mockAppointment}
                onCancel={jest.fn()}
                onConfirm={onConfirm}
            />
        )

        await user.click(screen.getByRole("button", { name: /finalizar/i }))
        expect(onConfirm).toHaveBeenCalledWith("FINISH")
    })

    it("chama onConfirm('CANCEL') ao clicar no botão 'Cancelar'", async () => {
        const onConfirm = jest.fn()
        const user = userEvent.setup()

        render(
            <ModalConfirmation
                type="CANCEL"
                appointment={mockAppointment}
                onCancel={jest.fn()}
                onConfirm={onConfirm}
            />
        )

        await user.click(screen.getByRole("button", { name: /cancelar/i }))
        expect(onConfirm).toHaveBeenCalledWith("CANCEL")
    })

    it("chama onCancel ao clicar no botão 'Voltar'", async () => {
        const onCancel = jest.fn()
        const user = userEvent.setup()

        render(
            <ModalConfirmation
                type="FINISH"
                appointment={mockAppointment}
                onCancel={onCancel}
                onConfirm={jest.fn()}
            />
        )

        await user.click(screen.getByRole("button", { name: /voltar/i }))
        expect(onCancel).toHaveBeenCalled()
    })
})