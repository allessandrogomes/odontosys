import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import bcrypt from "bcrypt"

// Esquema de validação com Zod
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

// PUT /api/dentist/:id

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = parseInt((await params).id)

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

        // Hasheia a senha
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)

        //Atualiza o usuário no banco de dados
        const updatedDentist = await prisma.dentist.update({
            where: { id },
            data: {
                ...validatedData,
                password: hashedPassword
            }
        })

        // Retorna sem a senha
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updatedDentistWithoutPassword } = updatedDentist

        return NextResponse.json(updatedDentistWithoutPassword, { status: 200 })

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