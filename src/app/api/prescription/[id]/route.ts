import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

// Esquema de validação com Zod
const prescriptionSchema = z.object({
    patientId: z.number().int().positive(),
    dentistId: z.number().int().positive(),
    medications: z.array(z.number().int().positive()),
    instructions: z.string().optional()
})

// Esquema de validação parcial com Zod
const partialPrescriptionSchema = z.object({
    patientId: z.number().int().positive().optional(),
    dentistId: z.number().int().positive().optional(),
    medications: z.array(z.number().int().positive()).optional(),
    instructions: z.string().optional()
})

// GET /api/prescriptions/id
export async function GET(request: Request, context: { params: { id: string } }) {
    try {
        // Converte o ID para número
        const id = parseInt(context.params.id)

        // Verifica se o ID é um número válido
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        // Busca a Prescrição pelo ID
        const prescription = await prisma.prescription.findUnique({
            where: { id }
        })

        // Verifica se a Prescrição foi encontrada
        if (!prescription) {
            return NextResponse.json(
                { error: "Prescrição não encontrada" },
                { status: 404 }
            )
        }

        // Retorna a Prescrição encontrada
        return NextResponse.json(prescription, { status: 200 })
    } catch (error) {
        // Trata erros inesperados
        console.error("Erro no servidor", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}

//PUT /api/prescription/id
export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const id = parseInt(context.params.id)

        // Verifica se o ID é válido
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        const body = await request.json()

        // Validação dos dados de entrada
        const validateData = prescriptionSchema.parse(body)

        // Atualiza a Prescrição no banco de dados
        const updatedPrescription = await prisma.prescription.update({
            where: { id },
            data: validateData
        })

        // Retorna a Prescrição atualizada
        return NextResponse.json(
            { message: "Prescrição atualizada com sucesso!", data: updatedPrescription },
            { status: 200 }
        )

    } catch (error) {
        // Tratamento de erros
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Tratamento de erro "Prescrição não encontrada"
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json(
                { error: "Prescrição não encontrada" },
                { status: 404 }
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

// PATCH /api/prescriptions/id
export async function PATCH(request: Request, context: { params: { id: string } }) {
    try {
        const id = parseInt(context.params.id)

        // Verifica se o ID é válido
        if (isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        const body = await request.json()

        // Validação dos dados de entrada
        const validateData = partialPrescriptionSchema.parse(body)

        // Atualiza apenas os campos enviados
        const updatedPrescription = await prisma.prescription.update({
            where: { id },
            data: validateData
        })

        return NextResponse.json(updatedPrescription, { status: 200 })
    } catch (error) {
        // Tratamento de erros
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Tratamento de erro "Prescrição não encontrada"
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json(
                { error: "Prescrição não encontrada" },
                { status: 404 }
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

// DELETE /api/prescription/id
export async function DELETE(request: Request, context: { params: { id: string } }) {
    try {
        const id = parseInt(context.params.id)

        // Verifica se ID é válido
        if(isNaN(id)) {
            return NextResponse.json(
                { error: "ID inválido" },
                { status: 400 }
            )
        }

        // Tenta excluir a Prescrição
        const deletedPrescription = await prisma.prescription.delete({
            where: { id }
        })

        // Retorna a Prescrição excluída
        return NextResponse.json(deletedPrescription, { status: 200 })
    } catch (error) {
        // Trata erros específicos do Prisma
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json(
                { error: "Prescrição não encontrada" },
                { status: 404 }
            )
        }

        // Trata outros erros inesperados
        console.error("Erro no servidor", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}