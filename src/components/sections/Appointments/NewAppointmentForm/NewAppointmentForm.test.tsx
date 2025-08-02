import { render } from '@testing-library/react'
import "@testing-library/jest-dom"
import NewAppointmentForm from '.'

jest.mock("@/components/ui/Label", () => {
    const MockLabel = () => <div>Label</div>
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
jest.mock("./PatientCPFView", () => {
    const MockPatientCPFView = () => <div data-testid="PatientCPFView">PatientCPFView</div>
    MockPatientCPFView.displayName = "PatientCPFView"
    return MockPatientCPFView
})
jest.mock("./ProcedureView", () => {
    const MockProcedureView = () => <div data-testid="ProcedureView">ProcedureView</div>
    MockProcedureView.displayName = "ProcedureView"
    return MockProcedureView
})
jest.mock("./DentistView", () => {
    const MockDentistView = () => <div data-testid="DentistView">DentistView</div>
    MockDentistView.displayName = "DentistView"
    return MockDentistView
})
jest.mock("./ScheduledView", () => {    
    const MockScheduledView = () => <div data-testid="ScheduledView">ScheduledView</div>
    MockScheduledView.displayName = "ScheduledView"
    return MockScheduledView
})

describe("NewAppointmentForm", () => {
    it("deve renderizar a tela inicial corretamente (snapshot)", () => {
        const { container } = render(<NewAppointmentForm />)
        expect(container).toMatchSnapshot()
    })
})