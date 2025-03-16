import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

// GET /api/completed-appointment
export async function GET() {
    try {
        // Busca todas as consultas concluídas
        const completedAppointments = await prisma.completedAppointment.findMany()

        // Se não houver consultas concluídas, retorna um array vazio
        if (completedAppointments.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        // Retorna as consultas concluídas
        return NextResponse.json(completedAppointments, { status: 200 })

    } catch (error) {
        //Log de erro para debug
        console.error("Erro ao buscar consultas canceladas:", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}

// Esquema de validação do ID
const idSchema = z.object({
    id: z.number().int().positive()
})

// POST /api/completed-appointment
export async function POST(request: Request) {
    try {
        const id = await request.json()

        // Validação do ID
        const validatedId = idSchema.parse(id)

        // Busca a consulta no banco de dados
        const appointment = await prisma.appointment.findUnique({
            where: { id: validatedId.id }
        })

        // Verifica se a consulta existe
        if (!appointment) {
            return NextResponse.json(
                { error: `Consulta com ID ${validatedId.id} não encontrada` },
                { status: 404 }
            )
        }

        // Verifica se a consulta já foi concluida
        const existingCompletedAppointment = await prisma.completedAppointment.findUnique({
            where: { id: validatedId.id }
        })

        if (existingCompletedAppointment) {
            return NextResponse.json(
                { error: `Consulta com o ID ${validatedId.id} já foi concluida` },
                { status: 400 }
            )
        }

        // Transação para garantir atomicidade
        const newCompletedAppointment = await prisma.$transaction(async (prisma) => {
            // Cria a consulta concluida
            const completedAppointment = await prisma.completedAppointment.create({
                data: {
                    id: appointment.id,
                    patientId: appointment.patientId,
                    dentistId: appointment.dentistId,
                    scheduledAt: appointment.scheduledAt,
                    procedure: appointment.procedure
                }
            })

            // Exclui a consulta original
            await prisma.appointment.delete({
                where: { id: validatedId.id }
            })

            return completedAppointment
        })

        // Retorna a consulta concluida
        return NextResponse.json(newCompletedAppointment, { status: 201 })

    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Log de erros inesperados
        console.error("Erro no servidor ao concluir consulta:", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}