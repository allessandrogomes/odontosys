import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


// GET /api/todays-appointments
export async function GET() {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    try {
        // Busca dentistas com consulta no dia
        const dentistsWithAppointmentsToday = await prisma.dentist.findMany({
            where: {
                appointments: {
                    some: {
                        scheduledAt: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                appointments: {
                    where: {
                        scheduledAt: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    },
                    orderBy: {
                        scheduledAt: "asc"
                    },
                    select: {
                        id: true,
                        scheduledAt: true,
                        endsAt: true,
                        procedure: true,
                        patient: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        
        return NextResponse.json(dentistsWithAppointmentsToday, { status: 200 })
    } catch (error) {
        console.error("Erro ao buscar as consultas do dia", error)

        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}