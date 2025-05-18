import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

// GET /api/patient
export async function GET() {
    try {
        // Busca todos os pacientes
        const patients = await prisma.patient.findMany()

        // Se não houver pacientes, retorna um array vazio
        if (patients.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        // Retorna os pacientes
        return NextResponse.json(patients)
    } catch (error) {
        // Log de erro para debug
        console.error("Erro ao buscar consultas canceladas", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}

// Esquema do Paciente
const patientSchema = z.object({
    name: z.string().transform(val => 
        val.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    ),
    email: z.string().email(),
    phone: z.string().transform(val => val.replace(/\D/g, "")),
    cpf: z.string()
        .transform(val => val.replace(/\D/g, ""))
        .refine(val => val.length === 11, "CPF deve conter 11 dígitos"),
    birthDate: z.string()
})

const fieldLabels: Record<string, string> = {
    cpf: "CPF",
    email: "Email",
    phone: "Telefone"
}

// POST /api/patient
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validação dos dados de entrada
        const validatedData = patientSchema.parse(body)

        // Cria o paciente no banco de dados
        const newPatient = await prisma.patient.create({
            data: validatedData
        })
        
        // Retorna o paciente criado
        return NextResponse.json(newPatient, { status: 201 })
    } catch (error) {
        // Tratamento de erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.errors },
                { status: 400 }
            )
        }

        // Erro de campo duplicado (único) no Prisma
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            const target = (error.meta?.target as string[])?.[0] //exemplo: "cpf" ou "email"
            const fieldName = fieldLabels[target] || target
            return NextResponse.json(
                { error: `Já existe um Paciente cadastrado com esse ${fieldName}`},
                { status: 409 }
            )
        }

        // Log de erros para debug
        console.error("Erro no servidor ao criar um novo Paciente", error)

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}