import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl
  // Rota pública "/" - Se tiver token válido, redireciona para a dashboard
  if (pathname === "/" && token) {
    try {
      const isValid = await validateToken(token, request)
      if (isValid) {
        const url = request.nextUrl.clone()
        url.pathname = "/dentist-dashboard"
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("Erro na validação do token:", error)
    }
  }

  // Rota protegida "/dentist-dashboard" - Se não tiver token ou for inválido, redireciona para login
  if (pathname.startsWith("/dentist-dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    const isValid = await validateToken(token, request)
    if (!isValid) {
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("token") // Remove o token inválido
      return response
    }
  }

  return NextResponse.next()
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
  matcher: ["/", "/dentist-dashboard/:path*"]
}