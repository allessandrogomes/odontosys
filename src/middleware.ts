import { NextResponse, type NextRequest } from "next/server"
import * as jwt from "jsonwebtoken"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl
  // Rota pública "/login" - Se tiver token válido, redireciona para a dashboard
  if (pathname === "/login" && token) {
    try {
      const isValid = await validateToken(token, request)
      if (isValid) {
        const role = getRoleFromToken(token)
        const dashboardPath = role === "DENTISTA" ? "/dentist-dashboard" : "receptionist-dashboard"
        return NextResponse.redirect(new URL(dashboardPath, request.url))
      }
    } catch (error) {
      console.error("Erro na validação do token:", error)
    }
  }

  // Rotas protegidas - Se não tiver token ou for inválido, redireciona para login
  if (pathname.startsWith("/dentist-dashboard") || pathname.startsWith("/receptionist-dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const isValid = await validateToken(token, request)
    const role = getRoleFromToken(token)

    if (!isValid) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token") // Remove o token inválido
      return response
    }

    // Verifica se a role corresponde à rota acessada
    if (
      (pathname.startsWith("/dentist-dashboard") && role !== "DENTISTA") ||
      (pathname.startsWith("/receptionist-dashboard") && role !== "RECEPCIONISTA")
    ) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      return response
    }
  }

  return NextResponse.next()
}

// Função para extrair a role do token (sem validar)
function getRoleFromToken(token: string): string {
  const decoded = jwt.decode(token) as { role?: string }
  return decoded?.role || ""
}

// Função para validar o token no backend
async function validateToken(token: string, request: NextRequest): Promise<boolean> {
  try {
    // Cria uma URL absoluta para a requisição
    const validateUrl = new URL('/api/validate-token', request.nextUrl.origin).toString()
    
    const response = await fetch(validateUrl, {
      method: 'POST',
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: 'include'
    })

    if (!response.ok) {
      console.error("Falha de validação com o status:", response.status)
      return false
    }

    const data = await response.json()
    return data.valid === true

  } catch (error) {
    console.error("Erro de validação do token:", error)
    return false
  }
}

// Configuração para aplicar apenas nas rotas desejadas
export const config = {
  matcher: ["/login", "/receptionist-dashboard/:path*", "/dentist-dashboard/:path*"]
}