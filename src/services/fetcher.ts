export default async function fetcher(url: string) {
    const res = await fetch(url, {
        credentials: "include", // importante para cookies de autenticação
        headers: {
            "Accept": "application/json"
        }
    })


    let data

    try {
        data = await res.json()
    } catch {
        throw new Error("Erro ao interpretar a resposta do servidor")
    }

    if (!res.ok) {
        const errorMessage = data?.error || data?.message || "Erro desconhecido"
        throw new Error(errorMessage)
    }

    return data
}