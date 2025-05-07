/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"

interface BusySchedule {
    dentistId: number
    start: string,
    end: string,
}

function generateSlots(date: string, startHour: number, endHour: number, durationMinutes: number): { start: Date; end: Date }[] {
    const slots: { start: Date; end: Date }[] = []
    let cursor = new Date(Date.UTC(
        Number(date.slice(0, 4)), // ano
        Number(date.slice(5, 7)) - 1, // mês (0-based)
        Number(date.slice(8, 10)), // dia
        startHour, 0, 0, 0 // hora, minuto, segundo, milissegundo
    ))

    const periodEnd = new Date(Date.UTC(
        Number(date.slice(0, 4)),
        Number(date.slice(5, 7)) - 1,
        Number(date.slice(8, 10)),
        endHour, 0, 0, 0
    ))

    while (cursor.getTime() + durationMinutes * 60000 <= periodEnd.getTime()) {
        const slotStart = new Date(cursor)
        const slotEnd = new Date(cursor.getTime() + durationMinutes * 60000)
        slots.push({ start: slotStart, end: slotEnd })
        cursor = slotEnd
    }

    return slots
}

function overlaps(
    aStart: Date, aEnd: Date,
    bStart: Date, bEnd: Date
): boolean {
    return aStart < bEnd && bStart < aEnd
}

export async function POST(request: NextRequest) {
    try {
        const { date, durationMinutes, dentistId } = await request.json()

        // 1. Buscar todos os horários ocupados
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
        const resp = await fetch(`${baseUrl}/api/busy-schedules`)
        if (!resp.ok) throw new Error('Erro ao buscar horários ocupados')
        const allBusy: BusySchedule[] = await resp.json()

        // 2. Filtrar apenas do dentista e da data informada
        const busyOnDate = allBusy
            .filter(s => s.dentistId === dentistId)
            .filter(s => s.start.slice(0, 10) === date)

        // 3. Gerar todos os slots nos dois períodos
        const morningSlots = generateSlots(date, 11, 15, durationMinutes)
        const afternoonSlots = generateSlots(date, 17, 21, durationMinutes)
        const allSlots = [...morningSlots, ...afternoonSlots]

        // 4. Filtrar os que não colidem com nenhum busyOnDate
        const available = allSlots.filter(slot => {
            return !busyOnDate.some(busy =>
                overlaps(
                    slot.start, slot.end,
                    new Date(busy.start),
                    new Date(busy.end)
                )
            )
        })

        // 5. Retornar em ISO strings
        const result = available.map(slot => ({
            start: slot.start.toISOString(),
            end: slot.end.toISOString()
        }))

        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Erro interno' },
            { status: 500 }
        )
    }
}