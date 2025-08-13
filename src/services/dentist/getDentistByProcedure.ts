/* eslint-disable @typescript-eslint/no-explicit-any */
const fetcher = async <T>(url: string): Promise<T> => {
    const response = await fetch(url, {
        credentials: "include",
        headers: {
            "Accept": "application/json"
        }
    })

    const contentType = response.headers.get("content-type")

    let data: unknown

    if (contentType?.includes("application/json")) {
        data = await response.json()
    } else {
        throw new Error("Resposta não está em formato JSON")
    }

    if (!response.ok) {
        const errorMessage =
            (data as any)?.error || (data as any)?.message || "Erro desconhecido"
        throw new Error(errorMessage)
    }

    return data as T
}

export default fetcher
