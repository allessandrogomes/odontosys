import { render } from "@testing-library/react"
import { EAppointmentStatus } from "@/types/EAppointmentStatus"
import "@testing-library/jest-dom"
import AppointmentsFound from "."

const mockAppointments: IAppointment[] = [
  {
    id: 11,
    patientId: 1,
    dentistId: 6,
    scheduledAt: "2025-05-05T18:00:00.000Z",
    endsAt: "2025-05-05T19:00:00.000Z",
    durationMinutes: 60,
    procedure: "EXTRAÇÃO",
    status: EAppointmentStatus.AGENDADA,
    createdAt: "2025-05-03T23:13:38.698Z",
    patient: {
      id: 1,
      name: "Fernandes Bovino Nunes Ferreira",
      email: "fernandes@email.com",
      phone: "74999871242",
      createdAt: "2025-04-16T01:17:47.991Z",
      cpf: "08734511123",
      birthDate: "1999-11-11T00:00:00.000Z",
      appointments: [],
      prescriptions: [],
      completedAppointments: [],
      cancelledAppointments: []
    },
    dentist: {
      id: 6,
      name: "Bruno Calil",
      email: "bruno@gmail.com",
      phone: "74999811122",
      createdAt: "2025-04-19T01:34:38.853Z",
      cpf: "08777466562",
      password: "$2b$10$cVGS7mW/FfPfH1jDiuXY4eDbE9kCaHxBRfwSoTFHzmrCpTO9EWn4O",
      role: "DENTISTA",
      birthDate: "18/09/1998",
      croNumber: "28397",
      specialty: ["EXTRAÇÃO", "ABERTURA CORONÁRIA"],
      appointments: [],
      prescriptions: [],
      completedAppointments: [],
      cancelledAppointments: [],
      blockedTimes: []
    }
  }
]

describe("AppointmentsFound", () => {
    // Testes de renderização
    it("aplica a classe 'visible' quando visible é true", () => {
        const { container } = render(
            <AppointmentsFound
                appointments={mockAppointments}
                selectedAppointment={jest.fn()}
                visible={true}
            />
        )

        const rootDiv = container.firstChild as HTMLElement
        expect(rootDiv.className).toMatch(/visible/)
    })

    it("não aplica a classe 'visible' quando visible é false", () => {
        const { container } = render(
            <AppointmentsFound 
                appointments={mockAppointments}
                selectedAppointment={jest.fn()}
                visible={false}
            />
        )

        const rootDiv = container.firstChild as HTMLElement
        expect(rootDiv.className).not.toMatch(/visible/)
    })
})