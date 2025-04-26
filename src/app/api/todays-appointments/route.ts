import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


// GET /api/todays-appointments
export async function GET() {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    try {
        // Busca as consultas do dia
        const appointments = await prisma.appointment.findMany({
            where: {
                scheduledAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            orderBy: {
                scheduledAt: "asc"
            }
        })
        
        return NextResponse.json(appointments, { status: 200 })
    } catch (error) {
        console.error("Erro ao buscar as consultas do dia", error)

        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}