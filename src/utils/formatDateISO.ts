export function formatDateISO(dateISO: string) {
    return new Date(dateISO).toLocaleDateString("pt-BR")
}