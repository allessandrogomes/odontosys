import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


// GET /api/busy/schedules
export async function GET() {
    try {
        // Busca todas as Consultas Atuais e Horários Bloqueados
        const appointments = await prisma.appointment.findMany()
        const blockedTimes = await prisma.blockedTime.findMany()

        // Cria um array com todos os horários ocupados
        const busySchedules = !appointments ? [] : appointments.map(item => item.scheduledAt)

        // Cria um array com todos os horários bloqueados
        const arrayOfBlockedTimes = !blockedTimes ? [] : blockedTimes.map(item => item.blockedTime)

        // Concatena todos os horários ocupados/bloqueados
        const allBlockedTimes = [...(busySchedules || []), ...(arrayOfBlockedTimes || [])]

        return NextResponse.json(allBlockedTimes, { status: 200 })
    } catch (error) {
        // Tratamento de erros
        console.error(error)
        return NextResponse.json(
            { error: "Erro no servidor", details: error },
            { status: 500 }
        )
    }
}