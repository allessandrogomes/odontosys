import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // Se tentar acessar /dentist-dashboard sem token → redireciona para "/"
  if (request.nextUrl.pathname.startsWith("/dentist-dashboard") && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Se o usuário TEM token e tenta acessar a página inicial "/" → redireciona para /dentist-dashboard
  if ((pathname === "/") && token) {
    return NextResponse.redirect(new URL("/dentist-dashboard", request.url))
  }

  return NextResponse.next()
}

// Configuração para aplicar apenas nas rotas desejadas
export const config = {
  matcher: ["/", "/dentist-dashboard/:path*"]
}