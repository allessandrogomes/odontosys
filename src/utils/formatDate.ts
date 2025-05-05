export function formatDate(date: string) {
    const dateWithTime = new Date(`${date}T12:00:00Z`)
    return dateWithTime.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    })
}