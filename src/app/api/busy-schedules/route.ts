import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


// GET /api/busy-schedules
export async function GET() {
    try {
        // Busca todas as Consultas Atuais e Horários Bloqueados
        const [appointments, blockedTimes] = await Promise.all([
            prisma.appointment.findMany(),
            prisma.blockedTime.findMany()
        ])

        // Extrai os horários ocupados e bloqueados
        const busySchedules = appointments.map(item => item.scheduledAt)
        const arrayOfBlockedTimes = blockedTimes.map(item => item.blockedTime)

        // Concatena todos os horários ocupados/bloqueados
        const allBlockedTimes = [...busySchedules, ...arrayOfBlockedTimes]

        return NextResponse.json(allBlockedTimes, { status: 200 })

    } catch (error) {
        // Tratamento de erros
        console.error("Erro ao buscar horários ocupados/bloqueados:", error)
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}