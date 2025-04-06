import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"


const blockeTimeSchema = z.object({
    blockedTime: z.string().datetime(),
    dentistId: z.number().int().positive()
})

// POST /api/blocked-time
export async function POST(request: Request) {
    try {
        const data = await request.json()

        // Realiza a validação dos dados recebidos
        const validateData = blockeTimeSchema.parse(data)

        // Cria o blocked time no banco de dados
        const newBlockedTime = await prisma.blockedTime.create({ data: validateData })

        return NextResponse.json(newBlockedTime, { status: 201 })

    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Log de erros para debug
        console.error("Erro no servidor", error)

        // Tratamento de erros inesperados
        return NextResponse.json(
            { error: "Erro interno do servidor", details: String(error) },
            { status: 500 }
        )
    }
}