import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"

export async function GET() {
    // Variável que armazena o token
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    // Verifica se o token existe
    if (!token) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, role: string }

        let user = null

        if (decoded.role === "DENTISTA") {
            user = await prisma.dentist.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    role: true,
                    croNumber: true,
                    specialty: true,
                    appointments: true,
                    prescriptions: true,
                    completedAppointments: true,
                    cancelledAppointments: true,
                    blockedTimes: true
                }
            })
        } else if (decoded.role === "RECEPCIONISTA") {
            user = await prisma.receptionist.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            })
        }

        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        return NextResponse.json({ error: "Token inválido", message: error }, { status: 401 })
    }
}