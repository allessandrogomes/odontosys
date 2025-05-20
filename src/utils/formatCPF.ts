export function formatCPF(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, "").slice(0, 11)

    if (cleaned.length !== 11) return cpf

    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}