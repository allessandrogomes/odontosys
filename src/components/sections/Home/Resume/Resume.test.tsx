import { render, screen, waitFor, within } from "@testing-library/react"
import "@testing-library/jest-dom"
import Resume from "."
import userEvent from "@testing-library/user-event"

// Mock global.fetch para evitar chamadas reais no useEffect

beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]) // Retorna um array vazio de appointments
        })
    ) as jest.Mock

    // Mock do matchMedia
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),    // deprecated
            removeListener: jest.fn(), // deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        }))
    })
})

const mockData = [
    {
        id: 1,
        name: "João",
        appointments: [
            {
                id: 101,
                scheduledAt: "2025-05-05T14:00:00.000Z",
                endsAt: "2025-05-05T15:00:00.000Z",
                procedure: "Limpeza",
                patient: { name: "Ana" }
            }
        ]
    },
    {
        id: 2,
        name: "Maria",
        appointments: [
            {
                id: 102,
                scheduledAt: "2025-05-05T14:00:00.000Z",
                endsAt: "2025-05-05T15:00:00.000Z",
                procedure: "Canal",
                patient: { name: "Bruno" }
            }
        ]
    }
]

describe("Dashboard do Recepcionista - Resume", () => {
    // Testes de renderização
    it("deve exibir os títulos 'Dentista' e 'Consultas' e o botão 'Atualizar'", async () => {
        render(<Resume />)

        await waitFor(() => {
            expect(screen.getByRole("heading", { name: /dentista/i })).toBeInTheDocument()
            expect(screen.getByRole("heading", { name: /consultas/i })).toBeInTheDocument()
            expect(screen.getByRole("button", { name: /atualizar/i })).toBeInTheDocument()
        })
    })

    it("deve mostrar o texto 'Carregando' e o spinner enquanto isLoading for true", async () => {
        // Simula fetch pendente para manter o isLoading
        global.fetch = jest.fn(() => new Promise(() => { })) as jest.Mock

        render(<Resume />)

        expect(screen.getByText(/Carregando/i)).toBeInTheDocument()
        expect(screen.getByTestId("spinner")).toBeInTheDocument()
    })

    it("deve mostrar a mensagem de erro quando error estiver presente", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: "Erro ao buscar dados" })
            })
        ) as jest.Mock

        render(<Resume />)

        await waitFor(() => {
            expect(screen.getByText(/Erro: Erro ao buscar dados/i)).toBeInTheDocument()
        })
    })

    it("deve exibir 'Não foi possível encontrar os dados das Consultas' quando todaysAppointments for null e não houver erro", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(null)
            })
        ) as jest.Mock

        render(<Resume />)

        await waitFor(() => {
            expect(screen.getByText(/Não foi possível encontrar os dados das Consultas/i)).toBeInTheDocument()
        })
    })

    it("deve exibir 'Nenhuma consulta para hoje' quando todaysAppointments for um array vazio", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        ) as jest.Mock

        render(<Resume />)

        await waitFor(() => {
            expect(screen.getByText(/Nenhuma consulta para hoje/i)).toBeInTheDocument()
        })
    })

    // Testes de interação com o botão Atualizar
    it("deve chamar a função fetchAppointments ao clicar no botão 'Atualizar'", async () => {
        const fetchMock = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        )

        global.fetch = fetchMock as jest.Mock

        render(<Resume />)

        const button = await screen.findByRole("button", { name: /atualizar/i })

        // Reseta a contagem para focar apenas no clique
        fetchMock.mockClear()



        await waitFor(() => {
            button.click()
            expect(fetchMock).toHaveBeenCalledTimes(1)
        })
    })

    // Testes com dados de consultas
    it("deve renderizar um DentistCard para cada dentista no array de consultas", async () => {

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData)
            })
        ) as jest.Mock

        render(<Resume />)

        for (const dentist of mockData) {
            expect(await screen.findByText(`Dr. ${dentist.name}`)).toBeInTheDocument()
        }
    })

    it("deve renderizar um AppointmentCard para cada consulta com os dados corretos", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData)
            })
        ) as jest.Mock

        render(<Resume />)

        for (const { appointments } of mockData) {
            for (const appointment of appointments) {
                expect(
                    await screen.findByText((content, element) =>
                        element?.tagName.toLowerCase() === "h4" &&
                        content.includes(appointment.patient.name)
                    )
                ).toBeInTheDocument()
                expect(
                    screen.getByText((content, element) =>
                        element?.tagName.toLowerCase() === "h4" &&
                        content.includes(appointment.procedure)
                    )
                ).toBeInTheDocument()
                expect(
                    screen.getAllByText((content, element) =>
                        element?.tagName.toLowerCase() === "h4" &&
                        content.includes("11:00 - 12:00")
                    )
                ).toHaveLength(2)
            }
        }
    })

    it("deve aplicar a prop isLast corretamente para o último AppointmentCard de cada lista", async () => {
        render(<Resume />)

        const timelines = await screen.findAllByTestId("timeline")

        timelines.forEach((timeline) => {
            const cards = within(timeline).getAllByTestId("appointment-card")
            const lastCard = cards[cards.length - 1]

            expect(lastCard.className).toMatch(/lastCard/)

            // Garante que os outros não tem a classe
            for (let i = 0; i < cards.length - 1; i++) {
                expect(cards[i]).not.toHaveClass("lastCard")
            }
        })
    })

    // Testes do modal de confirmação
    it("abre o modal com type = FINISH e dados da consulta ao clicar no botão finalizar", async () => {
        render(<Resume />)

        // Aguarda renderização do botão
        const finishButton = await screen.findAllByTitle("Confirmar conclusão da consulta")
        await userEvent.click(finishButton[0]) // Clica no primeiro botão "Finalizar"

        // Verifica se o modal apareceu com os dados corretos
        expect(await screen.findByRole("dialog")).toBeInTheDocument()
        expect(screen.getByText("Deseja Finalizar essa consulta?")).toBeInTheDocument()
        expect(screen.getByText(/Paciente:/i)).toHaveTextContent("Ana")
        expect(screen.getByText(/Procedimento:/i)).toHaveTextContent("Limpeza")
    })

    it("abre o modal com type = CANCEL e dados da consulta ao clicar no botão 'Cancelar'", async () => {
        render(<Resume />)

        // Espera os botões "Cancelar" carregarem
        const cancelButtons = await screen.findAllByTitle("Cancelar consulta")
        await userEvent.click(cancelButtons[0]) // Clica no primeiro botão "Cancelar"

        // Verifica se o modal foi aberto corretamente
        expect(await screen.findByRole("dialog")).toBeInTheDocument()
        expect(screen.getByText("Deseja Cancelar essa consulta?")).toBeInTheDocument()

        // Verifica se os dados da consulta estão corretos
        expect(screen.getByText(/Paciente:/i)).toHaveTextContent("Ana")
        expect(screen.getByText(/Procedimento:/i)).toHaveTextContent("Limpeza")
    })

    it("ao clicar em 'Voltar' no modal, ele deve fechar sem chamar a API", async () => {
        const fetchSpy = jest.spyOn(global, "fetch")

        render(<Resume />)

        // Espera os botões de cancelar consulta
        const cancelButtons = await screen.findAllByTitle("Cancelar consulta")
        await userEvent.click(cancelButtons[0])

        // Modal deve estar visível
        const modal = await screen.findByRole("dialog")
        expect(modal).toBeInTheDocument()

        // Simula clique em "Voltar"
        const backButton = screen.getByRole("button", { name: /voltar/i })
        await userEvent.click(backButton)

        // Verifica se o modal foi fechado
        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        })

        // Conta quantas chamadas de fetch existiam ANTES do clique em "Voltar"
        const initialCalls = fetchSpy.mock.calls.length

        // Espera um tempo curto para ver se alguma nova chamada ocorre após "Voltar"
        await new Promise(resolve => setTimeout(resolve, 200))

        // Verifica que nenhuma nova chamada foi feita
        expect(fetchSpy).toHaveBeenCalledTimes(initialCalls)
    })

    it("deve chamar a API de completed-appointment ao confirmar FINISH no modal", async () => {
        render(<Resume />)

        // Abre o modal de FINISH
        const finishButtons = await screen.findAllByTitle("Confirmar conclusão da consulta")
        await userEvent.click(finishButtons[0])

        // Confirma no modal
        const confirmButton = await screen.findByRole("button", { name: /finalizar/i })
        await userEvent.click(confirmButton)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/completed-appointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: 101 })
            })
        })
    })

    it("deve chamar a API de cancelled-appointment ao confirmar CANCEL no modal", async () => {
        render(<Resume />)

        // Abre o modal de CANCEL
        const cancellButtons = await screen.findAllByTitle("Cancelar consulta")
        await userEvent.click(cancellButtons[0])

        // Confirma no modal
        const modal = await screen.findByRole("dialog")
        const confirmButton = within(modal).getByRole("button", { name: /cancelar/i, hidden: true })

        await userEvent.click(confirmButton)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/cancelled-appointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: 101 })
            })
        })
    })

    // Cobertura geral
    it("deve chamar fetchAppointments apenas uma vez ao montar o componente", async () => {
        const fetchMock = jest.fn((url) => {
            if (url === "/api/todays-appointments") {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockData)
                }) as Promise<Response>
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            }) as Promise<Response>
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        global.fetch = fetchMock as any

        render(<Resume />)

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith("/api/todays-appointments", { method: "GET" })
        })

        // Verifica que só houve uma chamada ao endpoint de appointments
        const getCalls = fetchMock.mock.calls.filter(([url]) => url === "/api/todays-appointments")
        expect(getCalls).toHaveLength(1)
    })
})