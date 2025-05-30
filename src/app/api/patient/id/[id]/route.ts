import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

// Esquema de validação com Zod
const patientSchema = z.object({
    name: z.string(),
    email: z.string().email("Email inválido"),
    phone: z.string()
        .transform(val => val.replace(/\D/g, ""))
        .refine(val => val.length === 11, "O Telefone deve conter 11 dígitos"),
    cpf: z.string()
        .transform(val => val.replace(/\D/g, ""))
        .refine(val => val.length === 11, "CPF deve conter 11 dígitos"),
    birthDate: z.string()
}).strict()

const fieldLabels: Record<string, string> = {
    cpf: "CPF",
    email: "Email",
    phone: "Telefone"
}

// PUT /api/patient/id
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = parseInt((await params).id)
        //Verifica se o ID é inválido
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        const body = await request.json()

        // Validação dos dados de entrada
        const validatedData = patientSchema.parse(body)

        //Atualiza o usuário no banco de dados
        const updatedPatient = await prisma.patient.update({
            where: { id },
            data: validatedData
        })

        // Retorna os dados do Paciente atualizados
        return NextResponse.json(updatedPatient)
    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        // Tratamento de erro caso não encontre o Paciente
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json(
                    { error: "Paciente não encontrado" },
                    { status: 404 }
                )
            }
        }

        // Erro de campo duplicado (único) no Prisma
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            const target = (error.meta?.target as string[])?.[0] // exemplo: "cpf" ou "email"
            const fieldName = fieldLabels[target] || target
            return NextResponse.json(
                { error: `Já existe um Paciente cadastrado com esse ${fieldName} ` },
                { status: 409 }
            )
        }

        // Log de erros para debug
        console.error("PUT /api/patient Error:", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}