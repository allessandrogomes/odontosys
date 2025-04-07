import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcrypt"

// GET /api/receptionists
export async function GET() {
    try {
        // Busca todos os recepcionistas
        const receptionists = await prisma.receptionist.findMany()

        // Se não houver recepcionistas, retorna um array vazio
        if (receptionists.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        // Retorna os recepcionistas
        return NextResponse.json(receptionists)
    } catch (error) {
        // Log de erro para debug
        console.error("Erro ao buscar os recepcionistas", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}

// Esquema de recepcionista
const receptionistSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    cpf: z.string(),
    password: z.string(),
    role: z.string(),
    birthDate: z.string()
})

// POST /api/receptionists
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validação dos dados de entrada
        const validatedData = receptionistSchema.parse(body)

        // Hasheia a senha
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)
        
        // Cria o recepcionista
        const newReceptionist = await prisma.receptionist.create({
            data: {
                ...validatedData,
                password: hashedPassword
            }
        })

        // Retorna sem a senha
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...receptionistWithoutPassword } = newReceptionist

        // Retorna o recepcionista criado
        return NextResponse.json(receptionistWithoutPassword, { status: 201 })

    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Log de erros para debug
        console.error("Erro no servidor ao criar um novo Recepcionista", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}