import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import SearchAppointment from "."
import userEvent from "@testing-library/user-event"

// Mock do componente SearchField
jest.mock("@/components/sections/Appointments/SearchAppointment/SearchField", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MockSearchField = (props: { appointmentsFound: (a: any[]) => void, visible: boolean }) => {
        if (!props.visible) return null
        return (
            <button
                data-testid="search-field"
                onClick={() => props.appointmentsFound([{ id: 1, patientName: "Teste" }])}
            >
                SearchField
            </button>
        )
    }
    MockSearchField.displayName = "MockSearchField"
    return MockSearchField
})

// Mock do AppointmentsFound
jest.mock("@/components/sections/Appointments/SearchAppointment/AppointmentsFound", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockAppointmentsFound(props: { selectedAppointment: (a: any) => void, visible: boolean }) {
        if (!props.visible) return null
        return (
            <div
                data-testid="appointments-found"
                onClick={() => props.selectedAppointment({ id: 1, patientName: "Teste" })}
            >
                AppointmentsFound
            </div>
        )
    }
})

// Mock necessário para não quebrar renderização
jest.mock("@/components/cards/AppointmentCard", () => {
    return function MockAppointmentCard() {
        return <div data-testid="appointment-card">AppointmentCard</div>
    }
})

// Mock do BackBtn
jest.mock("@/components/ui/BackBtn", () => {
    return function MockBackBtn(props: { onClick: () => void }) {
        return <button data-testid="back-btn" onClick={props.onClick}>Voltar</button>
    }
})

describe("SearchAppointment", () => {
    // Testes de renderização
    it("deve exibir o título 'Buscar Consulta'", () => {
        render(<SearchAppointment />)
        const title = screen.getByText(/buscar consulta/i)
        expect(title).toBeInTheDocument()
    })

    it("deve exibir o componente SearchField inicialmente", () => {
        render(<SearchAppointment />)
        const searchField = screen.getByTestId("search-field")
        expect(searchField).toBeInTheDocument()
    })

    // Testes de interação
    it("deve mostrar o componente AppointmentsFound ao receber resultados do SearchField", async () => {
        render(<SearchAppointment />)

        const button = screen.getByTestId("search-field")
        // Simula clique para disparar o callback que preenche appointments
        await act(async () => {
            await userEvent.click(button)
        })

        // Verifica se o AppointmentFound aparece
        const appointmentsFound = screen.getByTestId("appointments-found")
        expect(appointmentsFound).toBeInTheDocument()
    })

    it("deve ocultar SearchField ao selecionar uma consulta", async () => {
        render(<SearchAppointment />)

        // Clica no SearchField para simular retorno de resultados
        const searchField = screen.getByTestId("search-field")
        await act(async () => {
            await userEvent.click(searchField)
        })

        // AppointmentsFound deve aparecer
        const appointmentsList = screen.getByTestId("appointments-found")
        expect(appointmentsList).toBeInTheDocument()

        // Clica em uma consulta para selecionar
        await act(async () => {
            await userEvent.click(appointmentsList)
        })

        expect(screen.queryByTestId("search-field")).not.toBeInTheDocument()
    })

    it("deve exibir AppointmentCard e BackBtn ao selecionar uma consulta", async () => {
        render(<SearchAppointment />)

        // Simula retorno de resultados
        const searchTrigger = screen.getByTestId("search-field")
        await act(async () => {
            await userEvent.click(searchTrigger)
        })

        // Simula seleção de uma consulta
        const appointmentsFound = screen.getByTestId("appointments-found")
        await act(async () => {
            await userEvent.click(appointmentsFound)
        })

        // Verifica se AppointmentCard está visível
        const card = screen.getByTestId("appointment-card")
        expect(card).toBeInTheDocument()

        // Verifica se o BackBtn está visível
        const backBtn = screen.getByTestId("back-btn")
        expect(backBtn).toBeInTheDocument()
    })

    it("deve voltar para a lista e ocultar AppointmentCard ao clicar no BackBtn", async () => {
        render(<SearchAppointment />)

        // Simula clique para buscar consultas
        await act(async () => {
            await userEvent.click(screen.getByTestId("search-field"))
        })

        // Simula clique para selecionar consulta
        await act(async () => {
            await userEvent.click(screen.getByTestId("appointments-found"))
        })

        // Confirma que o AppointmentCard e BackBtn estão visíveis
        expect(screen.getByTestId("appointment-card")).toBeInTheDocument()
        expect(screen.getByTestId("back-btn")).toBeInTheDocument()

        // Clica no botão voltar
        await act(async () => {
            await userEvent.click(screen.getByTestId("back-btn"))
        })

        // AppointmentCard deve desaparecer
        expect(screen.queryByTestId("appointment-card")).not.toBeInTheDocument()

        // AppointmentsFound deve voltar
        expect(screen.getByTestId("appointments-found")).toBeInTheDocument()
    })

    it("deve mostrar SearchField e AppointmentsFound apenas quando selectedAppointment for null", async () => {
        render(<SearchAppointment />)

        // Passo 1: estado inicial (selectedAppointment = null)
        expect(screen.getByTestId("search-field")).toBeInTheDocument()

        await act(async () => {
            await userEvent.click(screen.getByTestId("search-field"))
        })

        expect(screen.getByTestId("appointments-found")).toBeInTheDocument()

        // Passo 2: seleciona uma consulta (selectedAppointment != null)
        await act(async () => {
            await userEvent.click(screen.getByTestId("appointments-found"))
        })

        // SearchField e AppointmentsFound devem desaparecer
        expect(screen.queryByTestId("search-field")).not.toBeInTheDocument()
        expect(screen.queryByTestId("appointments-found")).not.toBeInTheDocument()

        // AppointmentCard deve estar visível
        expect(screen.getByTestId("appointment-card")).toBeInTheDocument()
    })

    it("deve exibir AppointmentCard e BackBtn apenas quando selectedAppointment estiver definido", async () => {
        render(<SearchAppointment />)

        // Antes de selecionar qualquer consulta
        expect(screen.queryByTestId("appointment-card")).not.toBeInTheDocument()
        expect(screen.queryByTestId("back-btn")).not.toBeInTheDocument()

        // Clica em SearchField e simula retorno de consultas
        await act(async () => {
            await userEvent.click(screen.getByTestId("search-field"))
        })

        // Clica em uma consulta
        await act(async () => {
            await userEvent.click(screen.getByTestId("appointments-found"))
        })

        // Agora ambos devem estar visíveis
        expect(screen.getByTestId("appointment-card")).toBeInTheDocument()
        expect(screen.getByTestId("back-btn")).toBeInTheDocument()
    })
})