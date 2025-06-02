export async function getAppointmentsByCPF(cpf: string) {
    const response = await fetch(`/api/appointment/cpf/${cpf}`)
    const data = await response.json()

    if (!response.ok) throw new Error(data.error || "Erro ao buscar as consultas")
    
    return data
}