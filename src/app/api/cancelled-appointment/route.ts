import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

// GET /api/cancelled-appointment
export async function GET() {
    try {
        // Busca todas as consultas canceladas
        const cancelledAppointments = await prisma.cancelledAppointment.findMany()

        // Se não houver consultas canceladas, retorna um array vazio
        if (cancelledAppointments.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        // Retorna as consultas canceladas
        return NextResponse.json(cancelledAppointments, { status: 200 })

    } catch (error) {
        // Log de erro para debug
        console.error("Erro ao buscar consultas canceladas:", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}

const dataSchema = z.object({
    id: z.number().int().positive(),
    reason: z.string().optional()
})

// POST /api/cancelled-appointment
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validação dos dados de entrada
        const validatedData = dataSchema.parse(body)

        // Busca a consulta no bacno de dados
        const appointment = await prisma.appointment.findUnique({
            where: { id: validatedData.id }
        })

        // Verifica se a consulta existe
        if (!appointment) {
            return NextResponse.json(
                { error: `Consulta com ID ${validatedData.id} não encontrada` },
                { status: 404 }
            )
        }

        // Verifica se a consulta já foi cancelada
        const existingCancelledAppointment = await prisma.cancelledAppointment.findUnique({
            where: { id: validatedData.id }
        })

        if (existingCancelledAppointment) {
            return NextResponse.json(
                { error: `Consulta com o ID ${validatedData.id} já foi cancelada` },
                { status: 400 }
            )
        }

        // Transação para garantir atomicidade
        const newCancelledAppointment = await prisma.$transaction(async (prisma) => {
            // Cria a consulta cancelada
            const cancelledAppointment = await prisma.cancelledAppointment.create({
                data: {
                    id: appointment.id,
                    patientId: appointment.patientId,
                    dentistId: appointment.dentistId,
                    scheduledAt: appointment.scheduledAt,
                    procedure: appointment.procedure,
                    reason: validatedData.reason || null
                }
            })

            // Exclui a consulta original
            await prisma.appointment.delete({
                where: { id: validatedData.id }
            })

            return cancelledAppointment
        })  

        // Retorna a consulta cancelada
        return NextResponse.json(newCancelledAppointment, { status: 201 })

    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Log de erros inesperados
        console.error("Erro no servidor ao cancelar consulta:", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}