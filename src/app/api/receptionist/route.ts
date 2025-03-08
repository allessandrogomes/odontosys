import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/receptionists
export async function GET() {
    const users = await prisma.receptionist.findMany()
    return NextResponse.json(users)
}

// POST /api/receptionists
export async function POST(request: Request) {
    const data = await request.json()
    const newUser = await prisma.receptionist.create({ data })
    return NextResponse.json(newUser, { status: 201 })
}