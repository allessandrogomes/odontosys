import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Esquema de validação com Zod
const updateUserSchema = z.object({
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
        const body = await request.json()

        // Validação dos dados de entrada
        const validateData = updateUserSchema.parse(body)

        //Atualiza o usuário no banco de dados
        const updateUser = await prisma.receptionist.update({
            where: { id },
            data: validateData
        })

        return NextResponse.json(updateUser)
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
                { error: "Usuário não encontrado" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500}
        )
    }
}