import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

// Esquema de validação total com Zod
const appointmentSchema = z.object({
    patientId: z.number().int().positive(),
    dentistId: z.number().int().positive(),
    scheduledAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    durationMinutes: z.number().int().positive(),
    procedure: z.string().min(1, "O procedimento é obrigatório"),
    status: z.enum(["AGENDADA", "CANCELADA", "CONCLUIDA"])
})

// Esquema de validação parcial com Zod
const partialAppointmentSchema = z.object({
    patientId: z.number().int().positive().optional(),
    dentistId: z.number().int().positive().optional(),
    scheduledAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    durationMinutes: z.number().int().positive().optional(),
    procedure: z.string().optional(),
    status: z.enum(["AGENDADA", "CANCELADA", "CONCLUIDA"]).optional()
})

// GET /api/appointment/id
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Converte o ID para número
        const id = parseInt((await params).id)

        // Verifica se o ID é um número válido
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        // Busca a Consulta pelo ID
        const appointment = await prisma.appointment.findUnique({
            where: { id }
        })

        // Verifica se a Consulta foi encontrada
        if (!appointment) {
            return NextResponse.json(
                { error: "Consulta não encontrada" },
                { status: 404 }
            )
        }

        // Retorna a Consulta encontrada
        return NextResponse.json(appointment, { status: 200 })

    } catch (error) {
        // Trata erros inesperados
        console.error("Erro no servidor", error)
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}

// PUT /api/appointment/id
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = parseInt((await params).id)

        // Verifica se o ID é inválido
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        const body = await request.json()

        // Validação dos dados de entrada
        const validatedData = appointmentSchema.parse(body)

        // Atualiza a consulta no banco de dados
        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: validatedData
        })

        return NextResponse.json(updatedAppointment, { status: 200 })

    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Tratamento de erros caso não encontre a consulta
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json(
                    { error: "Consulta não encontrada" },
                    { status: 400 }
                )
            }
        }

        // Log de erros para debug
        console.error("Erro no servidor", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}

// PATCH /api/appointment/id
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = parseInt((await params).id)

        // Verifica se o ID é inválido
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        const body = await request.json()

        // Validação dos dados de entrada
        const validatedData = partialAppointmentSchema.parse(body)

        // Atualiza apenas os campos enviados
        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: validatedData,
            include: {
                patient: true,
                dentist: true
            }
        })

        return NextResponse.json(updatedAppointment, { status: 200 })

    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Tratamento de erros caso não encontre a consulta
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json(
                    { error: "Consulta não encontrada" },
                    { status: 400 }
                )
            }
        }

        // Log de erros para debug
        console.error("Erro no servidor", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}

// DELETE /api/appointment/id
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Converte o ID para número
        const id = parseInt((await params).id)

        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        // Tenta excluir a Consulta
        const deletedAppointment = await prisma.appointment.delete({
            where: { id }
        })

        // Retorna a Consulta excluída
        return NextResponse.json(deletedAppointment, { status: 200 })

    } catch (error) {
        // Tratamento de erros caso não encontre a consulta
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json(
                    { error: "Consulta não encontrada" },
                    { status: 400 }
                )
            }
        }

        // Log de erros para debug
        console.error("Erro no servidor", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}