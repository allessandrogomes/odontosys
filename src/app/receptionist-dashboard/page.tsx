'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ReceptionistDashboard() {
    const [user, setUser] = useState<IDentist | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogout = async () => {
        try {
            // Chama a API de logout
            const res = await fetch("/api/logout", {
                method: "POST",
                credentials: "include"
            })

            if (!res.ok) throw new Error("Falha ao fazer o logout")

            // Redireciona para a página de login
            router.push("/")

            // Limpa o estado
            setUser(null)
        } catch (err) {
            setError(err instanceof Error ? err.message: "Erro ao sair")
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/me", { credentials: "include" })
                const data = await res.json()

                if (!res.ok) throw new Error(data.error || "Falha ao buscar usuário")

                setUser(data.user)
            } catch (err) {
                setError(err instanceof Error ? err.message: "Erro desconhecido")
                // Redireciona ou mostra mensagem de erro
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [])

    if (isLoading) return <p>Carregando...</p>
    if (error) return <p>Erro: {error}</p>
    if (!user) return <p>Não foi possível carregar os dados do usuário</p>

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    return (
        <>
            <h1>Bem-vindo, {capitalize(user.role)} {user.name}</h1>
            <h2>{user.croNumber}</h2>
            <p>Dashboard Recepcionista</p>
            <button onClick={handleLogout}>Sair</button>
        </>
    )
}