export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, "").slice(0, 11)

    if (cleaned.length < 10) return phone

    const ddd = cleaned.slice(0, 2)
    const firstPart = cleaned.length === 11 ? cleaned.slice(2, 7) : cleaned.slice(2, 6)
    const secondPart = cleaned.length === 11 ? cleaned.slice(7) : cleaned.slice(6)

    return `(${ddd}) ${firstPart}-${secondPart}`
}