import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"

interface AuthUser {
    id: number,
    role: string,
    name: string,
    cpf: string,
    password: string
}

const loginSchema = z.object({
    cpf: z.string()
        .transform(val => val.replace(/\D/g, ''))
        .refine(val => val.length === 11, "CPF deve conter 11 dígitos"),
    password: z.string().min(1, "Senha obrigatória")
})

export async function POST(request: Request) {
    try {
        const data = await request.json()

        // Valida os dados de entrada
        const validatedData = loginSchema.parse(data)

        const { cpf, password } = validatedData

        // Busca no banco de dados o tipo de usuário por meio do CPF
        const user = await prisma.$transaction([
            prisma.receptionist.findUnique({ where: { cpf } }),
            prisma.dentist.findUnique({ where: { cpf } })
        ]).then(([receptionist, dentist]) => receptionist || dentist) as AuthUser | null

        // Verificação unificada com proteção contra timing attack
        const passwordMatch = user
            ? await bcrypt.compare(password, user.password)
            : await bcrypt.compare(password, "$2b$10$fakestringdummyhash")


        if (!user || !passwordMatch) {
            return NextResponse.json(
                { error: "Credenciais inválidas" },
                { status: 401 }
            )
        }

        // Valida existência da secret antes de usar
        if (!process.env.JWT_SECRET) {
            throw new Error("Variável de ambiente JWT_SECRET não configurada")
        }

        // Gera o token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        // Resposta segura
        const response = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400
        })

        return response

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

        // Retorna um erro genérico
        return NextResponse.json(
            { error: "Erro interno no servidor", ...(process.env.NODE_ENV === "development" && { details: String(error) }) },
            { status: 500 }
        )
    }
}