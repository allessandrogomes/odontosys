import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcrypt"

// GET /api/dentist
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const procedureName = searchParams.get("procedure")


        let dentists

        // Se um procedimento for especificado, filtra os dentistas por especialidade
        // Caso contrário, busca todos os dentistas
        if (procedureName) {
            dentists = await prisma.dentist.findMany({
                where: {
                    specialty: {
                        has: procedureName
                    }
                },
            })
        } else {
            dentists = await prisma.dentist.findMany()
        }

        // Retorna os dentistas
        return NextResponse.json(dentists)

    } catch (error) {
        // Log de erro para debug
        console.error("Erro ao buscar os dentistas", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}

const dentistSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    cpf: z.string(),
    password: z.string(),
    role: z.string(),
    birthDate: z.string(),
    croNumber: z.string(),
    specialty: z.array(z.string())
})

// POST /api/dentist
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validação dos dados de entrada
        const validatedData = dentistSchema.parse(body)

        // Hasheia a senha
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)

        // Cria o dentista no banco de dados
        const newDentist = await prisma.dentist.create({
            data: {
                ...validatedData,
                password: hashedPassword
            }
        })

        // Retorna sem a senha
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...dentistWithoutPassword } = newDentist

        // Retorna o dentista criado
        return NextResponse.json(dentistWithoutPassword, { status: 201 })

    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Log de erros para debug
        console.error("Erro no servidor ao criar um novo Dentista", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}