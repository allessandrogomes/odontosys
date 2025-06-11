import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import "normalize.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: "OdontoSys",
  description: "Sistema completo para clínicas odontológicas, com funcionalidades de agendamento, gerenciamento de pacientes, controle de consultas e perfis personalizados para dentistas e recepcionistas. Desenvolvido com foco em eficiência no atendimento e organização da rotina clínica.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <head>
        <meta name="apple-mobile-web-app-title" content="MyWebSite" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
