import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const cpfSchema = z.object({
    cpf: z.string()
        .transform(val => val.replace(/\D/g, ""))
        .refine(val => val.length === 11, "CPF deve conter 11 dígitos")
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ cpf: string }> }) {
    try {
        const cpf = (await params).cpf

        const validatedCPF = cpfSchema.parse({ cpf })

        const appointmentsByCPF = await prisma.appointment.findMany({
            where: {
                patient: { cpf: validatedCPF.cpf }
            }
        })

        return NextResponse.json(appointmentsByCPF)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Erro interno no servidor" },
            { status: 500 }
        )
    }
}