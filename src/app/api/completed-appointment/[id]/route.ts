import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const idSchema = z.object({
    id: z.number().int().positive()
})

// GET /api/completed-appointment/id
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        // Converte o ID para número
        const id = parseInt(params.id)

        // Verifica se o ID é um número válido
        const validateId = idSchema.parse({ id })

        const completedAppointment = await prisma.completedAppointment.findUnique({
            where: { id: validateId.id }
        })

        if (!completedAppointment) {
            return NextResponse.json(
                { error: "Consulta Concluída não encontrada" },
                { status: 404 }
            )
        }

        return NextResponse.json(completedAppointment, { status: 200 })

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