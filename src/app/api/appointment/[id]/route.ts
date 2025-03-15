import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Esquema de validação total com Zod
const updateAppointmentSchema = z.object({
    patientId: z.number().int().positive(),
    dentistId: z.number().int().positive(),
    scheduledAt: z.string().datetime(),
    procedure: z.string().min(1, "O procedimento é obrigatório"),
    status: z.enum(["AGENDADA", "CANCELADA", "CONCLUIDA"])
})

// Esquema de validação parcial com Zod
const partialUpdateAppointmentSchema = z.object({
    patientId: z.number().int().positive().optional(),
    dentistId: z.number().int().positive().optional(),
    scheduledAt: z.string().datetime().optional(),
    procedure: z.string().optional(),
    status: z.enum(["AGENDADA", "CANCELADA", "CONCLUIDA"]).optional()
})

// GET /api/appointment/id
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        // Converte o ID para número
        const id = parseInt(params.id)

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
                { error: "Consulta não encontrada"},
                { status: 404 }
            )
        }

        // Retorna a Consulta encontrada
        return NextResponse.json(appointment, { status: 200 })

    } catch (error){
        // Trata erros inesperados
        console.error("Erro no servidor", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}

// PUT /api/appointment/id
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id)
        const body = await request.json()

        // Validação dos dados de entrada
        const validateData = updateAppointmentSchema.parse(body)

        // Atualiza a consulta no banco de dados
        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: validateData
        })

        return NextResponse.json(updatedAppointment, { statusText: "Consulta atualizada com sucesso!", status: 200 })
    } catch (error) {
        // Tratamento de erros
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        if (error instanceof Error && error.message.includes("RecordNotFound")) {
            return NextResponse.json(
                { error: "Consulta não encontrada" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}

// PATCH /api/appointment/id
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id)
        const body = await request.json()

        // Validação dos dados de entrada
        const validateData = partialUpdateAppointmentSchema.parse(body)

        // Atualiza apenas os campos enviados
        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: validateData
        })

        return NextResponse.json(updatedAppointment, { status: 200 })
    } catch (error) {
        // Tratamento de erros
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        if (error instanceof Error && error.message.includes("RecordNotFound")) {
            return NextResponse.json(
                { error: "Consulta não encontrada" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}

// DELETE /api/appointment/id
export async function DELETE(request: Request, { params }: { params: { id: string } } ) {
    try {
        // Converte o ID para número
        const id = parseInt(params.id)

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
        // Trata erros específicos do Prisma
        if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
            return NextResponse.json(
                { error: "Consulta não encontrada" },
                { status: 404 }
            )
        }

        // Trata outros erros
        console.error("Erro no servidor", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}