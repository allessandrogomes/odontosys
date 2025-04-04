import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

// Esquema de validação com Zod
const receptionistSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    cpf: z.string(),
    birthDate: z.string()
})

// PUT /api/recepcionists/:id

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id)

        // Verifica se o ID é inválido
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        const body = await request.json()

        // Validação dos dados de entrada
        const validatedData = receptionistSchema.parse(body)

        // Atualiza o usuário no banco de dados
        const updatedReceptionist = await prisma.receptionist.update({
            where: { id },
            data: validatedData
        })

        // Retorna o receptionista atualizado
        return NextResponse.json(updatedReceptionist, { status: 200 })

    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Tratamento de erros caso não encontre o recepcionista
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json(
                    { error: "Recepcionista não encontrado" },
                    { status: 404 }
                )
            }
        }

        // Log de erros para debug
        console.error("PUT /api/receptionist Error:", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}