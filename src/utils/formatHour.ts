export function formatHour(isoString: string): string {
    return new Date(isoString).toISOString().substring(11, 16)
}