import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// GET /api/appointment
export async function GET() {
    try {
        // Busca todas as consultas
        const appointments = await prisma.appointment.findMany({
            include: {
                patient: true,
                dentist: true
            }
        })

        // Se não houver consultas, retorna um array vazio]
        if (appointments.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        // Retorna as consultas
        return NextResponse.json(appointments)

    } catch (error) {
        // Log de erro para debug
        console.error("Erro ao buscar as consultas", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }

}

// Esquema de consulta
const appointmentSchema = z.object({
    patientId: z.number().int().positive(),
    dentistId: z.number().int().positive(),
    scheduledAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    durationMinutes: z.number().int().positive(),
    procedure: z.string().min(1, "O procedimento é obrigatório")
})

// POST /api/appointment
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validação dos dados de entrada
        const validatedData = appointmentSchema.parse(body)

        // Cria a consulta no banco de dados
        const newAppointment = await prisma.appointment.create({
            data: validatedData
        })

        // Retorna a consulta criada 
        return NextResponse.json(newAppointment, { status: 201 })

    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Log de erros para debug
        console.error("Erro no servidor ao criar uma nova Consulta", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) }, 
            { status: 500 }
        )
    }
}