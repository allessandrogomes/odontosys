import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

// Esquema de validação
const validationSchema = z.object({
    id: z.number().int().positive(),
    patientId: z.number().int().positive(),
    dentistId: z.number().int().positive(),
    scheduledAt: z.string().datetime(),
    procedure: z.string().min(1, "O procedimento é obrigatório")
})

// GET /api/completed-appointment
export async function GET() {
    try {
        const completedAppointments = await prisma.completedAppointment.findMany()
        return NextResponse.json(completedAppointments)
    } catch (error) {
        return NextResponse.json(
            { error: "Dados não encontrados", details: error },
            { status: 400 }
        )
    }
}

// POST /api/completed-appointment
export async function POST(request: Request) {
    try {
        const data = await request.json()

        const validatedData = validationSchema.parse(data)

        const newCompletedAppointment = await prisma.completedAppointment.create({
            data: {
                id: data.id,
                patientId: validatedData.patientId,
                dentistId: validatedData.dentistId,
                scheduledAt: validatedData.scheduledAt,
                procedure: validatedData.procedure
            }
        })

        await prisma.appointment.delete({
            where: { id: data.id }
        })

        return NextResponse.json(newCompletedAppointment, { status: 201 })
    } catch (error) {
        // Tratamento de erro de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }
        // Tratamento de erros inesperados
        console.error("Error no servidor:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}