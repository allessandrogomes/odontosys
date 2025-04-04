import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

// Esquema de validação com Zod
const dentistSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    cpf: z.string(),
    birthDate: z.string(),
    croNumber: z.string(),
    specialty: z.string()
})

// PUT /api/dentist/:id

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
        const validatedData = dentistSchema.parse(body)

        //Atualiza o usuário no banco de dados
        const updatedDentist = await prisma.dentist.update({
            where: { id },
            data: validatedData
        })

        return NextResponse.json(updatedDentist, { status: 200 })

    } catch (error) {
        // Tratamento de erros
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Tratamento de erro caso não encontre o Dentista
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json(
                    { error: "Dentista não encontrado" },
                    { status: 404 }
                )
            }
        }

        // Log de erros para debug
        console.error("PUT /api/dentist Error:", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno do servidor", details: String(error) },
            { status: 500}
        )
    }
}