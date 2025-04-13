import { NextResponse } from "next/server"

export async function POST() {

    try {
        const response = NextResponse.json({ message: "Logout realizado" })

        // Remove o cookie
        response.cookies.delete("token")

        return response
    } catch (error) {
        NextResponse.json(
            { error: "Erro ao fazer o Logout", details: error },
            { status: 500 }
        )
    }
}