import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import Resume from "."

// Mock global.fetch para evitar chamadas reais no useEffect

beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]) // Retorna um array vazio de appointments
        })
    ) as jest.Mock
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
})