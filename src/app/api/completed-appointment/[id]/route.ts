import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const idSchema = z.object({
    id: z.number().int().positive({ message: "O ID deve ser um número inteiro positivo" })
})

// GET /api/completed-appointment/id
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Converte o ID para número
        const id = parseInt((await params).id)

        // Verificação explícita para NaN
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido: não é um número" },
                { status: 400 }
            )
        }

        // Validação do ID com Zod
        const validatedId = idSchema.parse({ id })

        // Busca a consulta concluída
        const completedAppointment = await prisma.completedAppointment.findUnique({
            where: { id: validatedId.id }
        })

        if (!completedAppointment) {
            return NextResponse.json(
                { error: `Consulta concluída com ID ${validatedId.id} não encontrada` },
                { status: 404 }
            )
        }

        return NextResponse.json(completedAppointment, { status: 200 })

    } catch (error) {
        // Tratamento de erro de validação do Zod
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors.map(e => `${e.path}: ${e.message}`) },
                { status: 400 }
            )
        }

        // Log detalhado do erro
        console.error(`Erro ao buscar a consulta concluída (ID: ${(await params).id}):`, error)

        // Resposta de erro genérica
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}