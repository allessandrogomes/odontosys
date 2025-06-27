import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET() {
    try {
        const procedures = await prisma.procedure.findMany({
            orderBy: {
                procedure: "asc" // ordem alfabética crescente
            }
        })

        if (procedures.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(procedures)
    } catch (error) {
        console.error("Erro ao buscar os procedimentos", error)

        return NextResponse.json(
            { error: "Erro interno no servidor", details: String(error) },
            { status: 500 }
        )
    }
}