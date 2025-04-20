// src/app/api/available-slots/route.ts
import { NextResponse } from "next/server"

interface BlockedSlot {
  start: string
  end: string
  dentistId: number
}

function getTimeIntervals(start: string, end: string, duration: number) {
  const intervals = []
  let current = new Date(start)

  while (current < new Date(end)) {
    const endSlot = new Date(current.getTime() + duration * 60000)
    if (endSlot > new Date(end)) break

    intervals.push({
      start: current.toTimeString().slice(0, 5),
      end: endSlot.toTimeString().slice(0, 5),
      startISO: current.toISOString(),
      endISO: endSlot.toISOString()
    })

    current = endSlot
  }

  return intervals
}

function isOverlapping(slotStart: Date, slotEnd: Date, blocked: BlockedSlot[]) {
  return blocked.some(b => {
    const bStart = new Date(b.start)
    const bEnd = new Date(b.end)
    return slotStart < bEnd && slotEnd > bStart
  })
}

export async function POST(req: Request) {
  const { dentistId, durationMinutes } = await req.json()

  // Simulação do fetch dos horários ocupados
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
  const response = await fetch(`${baseUrl}/api/busy-schedules`)
  const blockedSlots: BlockedSlot[] = await response.json()

  const filteredBlocked = blockedSlots.filter(b => b.dentistId === dentistId)

  const result = []

  for (let i = 0; i < 7; i++) {
    const day = new Date()
    day.setDate(day.getDate() + i)
    const weekday = day.getDay()

    if (weekday === 0 || weekday === 6) continue

    const dateString = day.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit"
    })

    const slots = []

    // Manhã
    const morningStart = new Date(day)
    morningStart.setHours(8, 0, 0, 0)
    const morningEnd = new Date(day)
    morningEnd.setHours(12, 0, 0, 0)

    slots.push(...getTimeIntervals(morningStart.toISOString(), morningEnd.toISOString(), durationMinutes))

    // Tarde
    const afternoonStart = new Date(day)
    afternoonStart.setHours(14, 0, 0, 0)
    const afternoonEnd = new Date(day)
    afternoonEnd.setHours(18, 0, 0, 0)

    slots.push(...getTimeIntervals(afternoonStart.toISOString(), afternoonEnd.toISOString(), durationMinutes))

    const available = slots.filter(slot => {
      const start = new Date(slot.startISO)
      const end = new Date(slot.endISO)
      return !isOverlapping(start, end, filteredBlocked)
    })

    result.push({
      day: dateString,
      slots: available.map(s => ({
        start: s.start,
        end: s.end,
        startISO: s.startISO,
        endISO: s.endISO
      }))
    })
  }

  return NextResponse.json(result)
}