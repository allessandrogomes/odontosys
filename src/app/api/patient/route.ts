import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/patient
export async function GET() {
    const users = await prisma.patient.findMany()
    return NextResponse.json(users)
}

// POST /api/patient
export async function POST(request: Request) {
    const data = await request.json()
    const newUser = await prisma.patient.create({ data })
    return NextResponse.json(newUser, { status: 201 })
}