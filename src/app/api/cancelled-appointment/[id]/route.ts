import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const idSchema = z.object({
    id: z.number().int().positive()
})

// GET /api/cancelled-appointment/id
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        // Converte o ID para número
        const id = parseInt(params.id)

        // Verifica se o ID é um número válido
        const validateId = idSchema.parse({ id })

        const cancelledAppointment = await prisma.cancelledAppointment.findUnique({
            where: { id: validateId.id }
        })

        if (!cancelledAppointment) {
            return NextResponse.json(
                { error: "Consulta Cancelada não encontrada" },
                { status: 404 }
            )
        }

        return NextResponse.json(cancelledAppointment, { status: 200 })

    } catch (error) {
        // Tratamento de erro de validação de dados
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "ID inválido", details: error.errors },
                { status: 400 }
            )
        }

        // Tratamento de erros inesperados
        console.error("Erro no servidor", error)
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}