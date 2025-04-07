import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
    const { cpf, password } = await request.json()

    // Busca no banco de dados o tipo de usuário por meio do CPF
    const user = 
        (await prisma.receptionist.findUnique({ where: { cpf } })) ||
        (await prisma.dentist.findUnique({ where: { cpf } }))

    // Retorna caso não encontre esse usuário
    if (!user) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Verifica a senha
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
    }

    // Gera o token
    const token = jwt.sign(
        {
            id: user.id,
            role: user.role,
            name: user.name,
            cpf: user.cpf
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    )

    return NextResponse.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            role: user.role
        }
    })
}