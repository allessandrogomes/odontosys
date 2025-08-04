import { render, screen } from '@testing-library/react'
import "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event'
import NewAppointmentForm from '.'

jest.mock("@/components/ui/Label", () => {
    const MockLabel = ({ text }: { text: string }) => <div>{text}</div>
    MockLabel.displayName = "Label"
    return MockLabel
})
jest.mock("@/components/ui/Button", () => {
    const MockButton = ({ text, iconStart, ...props }: { text?: React.ReactNode; iconStart?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button {...props}>
            {iconStart && <span data-testid="icon-start">{iconStart}</span>}
            {text}
        </button>
    )
    MockButton.displayName = "Button"
    return MockButton
})
jest.mock("@/components/ui/Card", () => {
    const MockCard = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
    MockCard.displayName = "Card"
    return MockCard
})
jest.mock("@/components/ui/Spinner", () => {
    const MockSpinner = () => <div>Spinner</div>
    MockSpinner.displayName = "Spinner"
    return MockSpinner
})
jest.mock("@/components/layout/SectionWrapper", () => {
    const MockSectionWrapper = ({ children }: { children?: React.ReactNode }) => <section>{children}</section>
    MockSectionWrapper.displayName = "SectionWrapper"
    return MockSectionWrapper
})

// Mockando views internas para isolar a renderização inicial
import React from "react"

jest.mock("./PatientCPFView", () => {
    type PatientCPFViewProps = {
        patient: (data: { id: number; name: string }) => void;
        onNext: () => void;
        visible: boolean;
    }
    const MockPatientCPFView: React.FC<PatientCPFViewProps> = ({ patient, onNext, visible }) => {
        const [selected, setSelected] = React.useState(false)

        return visible ? (
            <div data-testid="PatientCPFView">
                PatientCPFView
                {!selected ? (
                    <button
                        onClick={() => {
                            patient({ id: 1, name: "João da Silva" })
                            setSelected(true)
                        }}
                    >
                        Buscar paciente
                    </button>
                ) : (
                    <button onClick={onNext}>Próximo</button>
                )}
            </div>
        ) : null
    }
    MockPatientCPFView.displayName = "PatientCPFView"
    return MockPatientCPFView
})
jest.mock("./ProcedureView", () => {
    type ProcedureViewProps = {
        onNext: () => void;
        onSelectProcedure?: (data: { procedure: string; durationMinutes: number }) => void;
        active: boolean;
    };
    const MockProcedureView: React.FC<ProcedureViewProps> = ({ onNext, onSelectProcedure, active }) =>
        active ? (
            <div data-testid="ProcedureView">
                ProcedureView
                <button
                    onClick={() => {
                        onSelectProcedure?.({ procedure: "Limpeza", durationMinutes: 30 })
                    }}
                >
                    Selecionar procedimento
                </button>
                <button onClick={onNext}>Avançar</button>
            </div>
        ) : null
    MockProcedureView.displayName = "ProcedureView"
    return MockProcedureView
})
jest.mock("./DentistView", () => {
    type DentistViewProps = {
        dentistId: (id: number) => void;
        dentistName: (name: string) => void;
        onNext: () => void;
        visible: boolean;
    };
    const MockDentistView: React.FC<DentistViewProps> = ({ dentistId, dentistName, onNext, visible }) => {
        const [step, setStep] = React.useState<"select" | "confirm">("select")

        return visible ? (
            <div data-testid="DentistView">
                {step === "select" ? (
                    <>
                        <p>Lista de dentistas:</p>
                        <button
                            onClick={() => {
                                dentistId(10)
                                dentistName("Fulano")
                                setStep("confirm")
                            }}
                        >
                            Selecionar Dentista
                        </button>
                    </>
                ) : (
                    <>
                        <p>Dentista selecionado: Fulano</p>
                        <button onClick={onNext}>Confirmar Dentista</button>
                    </>
                )}
            </div>
        ) : null
    }
    MockDentistView.displayName = "DentistView"
    return MockDentistView
})
jest.mock("./ScheduledView", () => {
    type ScheduledViewProps = {
        scheduledAt: (date: string) => void;
        endsAt: (date: string) => void;
        onNext: () => void;
        onBack: () => void;
        active: boolean;
    };

    const MockScheduledView: React.FC<ScheduledViewProps> = ({
        scheduledAt,
        endsAt,
        onNext,
        onBack,
        active
    }) => {
        const [step, setStep] = React.useState<"select" | "confirm">("select")

        if (!active) return null

        return (
            <div data-testid="ScheduledView">
                {step === "select" ? (
                    <>
                        <p>Selecione horário</p>
                        <button onClick={() => {
                            scheduledAt("2025-08-01T10:00:00Z")
                            endsAt("2025-08-01T10:30:00Z")
                            setStep("confirm")
                        }}>
                            Selecionar Horário
                        </button>
                        <button onClick={onBack}>Voltar</button>
                    </>
                ) : (
                    <>
                        <p>Horário confirmado: 10:00 - 10:30</p>
                        <button onClick={onNext}>Próximo</button>
                    </>
                )}
            </div>
        )
    }

    MockScheduledView.displayName = "ScheduledView"
    return MockScheduledView
})

beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true })
        })
    )
})

describe("NewAppointmentForm", () => {
    it("deve renderizar a tela inicial corretamente (snapshot)", () => {
        const { container } = render(<NewAppointmentForm />)
        expect(container).toMatchSnapshot()
    })

    it("deve navegar corretamente entre as views usando os botões de avanço", async () => {
        const user = userEvent.setup()
        render(<NewAppointmentForm />)

        // View inicial: PATIENT_VIEW
        expect(screen.getByTestId("PatientCPFView")).toBeInTheDocument()

        // Patient
        await user.click(screen.getByText("Buscar paciente"))
        await user.click(screen.getByText("Próximo"))

        // Procedure
        await screen.findByTestId("ProcedureView")
        await user.click(screen.getByText("Selecionar procedimento"))
        await user.click(screen.getByText("Avançar"))

        // Dentist
        await screen.findByTestId("DentistView")
        await user.click(screen.getByText("Selecionar Dentista"))
        await user.click(screen.getByText("Confirmar Dentista")) // <== apenas 1 clique chama onNext

        // ScheduledView (etapa 1)
        expect(await screen.findByTestId("ScheduledView")).toBeInTheDocument()
        await user.click(screen.getByText("Selecionar Horário"))

        // ScheduledView (etapa 2)
        expect(screen.getByText("Horário confirmado: 10:00 - 10:30")).toBeInTheDocument()

        // Confirma e avança para CONFIRM_APPOINTMENT_VIEW
        await user.click(screen.getByText("Próximo"))

        // Confirmação
        expect(screen.getByText("Informações do Agendamento")).toBeInTheDocument()
        expect(screen.getByText((text) => text.includes("João da Silva"))).toBeInTheDocument()
        expect(screen.getByText((text) => text.includes("Limpeza"))).toBeInTheDocument()
        expect(screen.getByText((text) => text.includes("Dr. Fulano"))).toBeInTheDocument()
        expect(screen.getByText((text) => text.includes("30 Minutos"))).toBeInTheDocument()
        expect(screen.getByText((text) => text.includes("01/08/2025"))).toBeInTheDocument()

        // Clica no botão de agendar
        await user.click(screen.getByText("Agendar"))

        // Verifica se a mensagem de sucesso é exibida
        expect(screen.getByText("Agendamento realizado com sucesso!")).toBeInTheDocument()
    })

    it("deve navegar corretamente para trás usando os botões de voltar", async () => {
        const user = userEvent.setup()
        render(<NewAppointmentForm />)

        // -> PatientCPFView
        await user.click(screen.getByText("Buscar paciente"))
        await user.click(screen.getByText("Próximo"))

        // -> ProcedureView
        await screen.findByTestId("ProcedureView")
        await user.click(screen.getByText("Selecionar procedimento"))
        await user.click(screen.getByText("Avançar"))

        // -> DentistView
        await screen.findByTestId("DentistView")
        await user.click(screen.getByText("Selecionar Dentista"))
        await user.click(screen.getByText("Confirmar Dentista"))

        // -> ScheduledView
        await screen.findByTestId("ScheduledView")
        await user.click(screen.getByText("Selecionar Horário"))
        await user.click(screen.getByText("Próximo"))

        // -> ConfirmAppointmentView
        expect(screen.getByText("Informações do Agendamento")).toBeInTheDocument()

        // <- Voltar para ScheduledView
        await user.click(screen.getByText("Voltar"))
        expect(screen.getByTestId("ScheduledView")).toBeInTheDocument()

        // <- Voltar para DentistView
        await user.click(screen.getByText("Voltar"))
        expect(screen.getByTestId("DentistView")).toBeInTheDocument()

        // <- Voltar para ProcedureView
        await user.click(screen.getByText("Voltar"))
        expect(screen.getByTestId("ProcedureView")).toBeInTheDocument()

        // <- Voltar para PatientCPFView
        await user.click(screen.getByText("Voltar"))
        expect(screen.getByTestId("PatientCPFView")).toBeInTheDocument()
    })
})

// Limpa os mocks após cada teste
afterAll(() => {
  jest.resetAllMocks() // ou jest.resetAllMocks()
})