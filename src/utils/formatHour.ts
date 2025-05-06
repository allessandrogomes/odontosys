export function formatHour(hourISO: string) {
    if (!hourISO) return ""
    const hour = new Date(hourISO).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })

    return hour
}