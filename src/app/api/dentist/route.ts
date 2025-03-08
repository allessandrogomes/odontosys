import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/dentist
export async function GET() {
    const users = await prisma.dentist.findMany()
    return NextResponse.json(users)
}

// POST /api/dentist
export async function POST(request: Request) {
    const data = await request.json()
    const newUser = await prisma.dentist.create({ data })
    return NextResponse.json(newUser, { status: 201 })
}