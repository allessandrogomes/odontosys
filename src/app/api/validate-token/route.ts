/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
    // 1. Verifica o secret
    if (!process.env.JWT_SECRET) {
        return NextResponse.json(
            { valid: false, error: "Servidor com problema de configuração" },
            { status: 500 }
        )
    }

    // 2. Extrai o token
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.split(" ")[1]
    
    if (!token) {
        return NextResponse.json(
            { valid: false, error: "Token não encontrado" },
            { status: 401 }
        )
    }

    // 3. Validação
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return NextResponse.json({
            valid: true,
            user: {
                id: (decoded as any).id,
                role: (decoded as any).role
            }
        })
    } catch (error) {
        return NextResponse.json(
            { valid: false, error: "Token inválido" },
            { status: 401 }
        )
    }
}