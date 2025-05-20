import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

// Esquema de validação com Zod
const patientSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    cpf: z.string(),
    birthDate: z.string()
}).strict()

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
                { error: "Dados inválidos", details: error.errors },
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

        // Log de erros para debug
        console.error("PUT /api/patient Error:", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}