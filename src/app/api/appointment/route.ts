import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/appointment
export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany()
        return NextResponse.json(appointments)
    } catch (error) {
        return NextResponse.json(
            { error: "Consultas não encontradas", details: error },
            { status: 400 }
        )
    }

}

// POST /api/appointment
export async function POST(request: Request) {
    try {
        const data = await request.json()
        const newAppointment = await prisma.appointment.create({ data })
        return NextResponse.json(newAppointment, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Não foi possível criar a Consulta.", details: error }, { status: 500 })
    }
}