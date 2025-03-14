import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

// Esquema de validação com Zod
const prescriptionSchema = z.object({
    patientId: z.number().int().positive(),
    dentistId: z.number().int().positive(),
    prescriptionDetails: z.string()
})

// POST /api/prescription
export async function POST(request: Request) {
    try {
        // Recebe os dados retornados
        const data = await request.json()

        // Validação dos dados de entrada
        const validatedData = prescriptionSchema.parse(data)

        // Cria a Prescrição
        const newPrescription = await prisma.prescription.create({data: validatedData})

        // Caso esteja tudo ok, retorna a Prescrição criada
        return NextResponse.json(newPrescription, { status: 201 })
    } catch (error) {
        // Tratamento de erro de validação de dados
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Tratamento de erros inesperados
        console.error("Erro no servidor", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}