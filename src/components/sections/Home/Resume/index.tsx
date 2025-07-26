/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import AppointmentCard from "./AppointmentCard"
import DentistCard from "./DentistCard"
import styles from "./styles.module.scss"
import { Toaster, toast } from "react-hot-toast"
import Spinner from "@/components/ui/Spinner"
import { RefreshCw } from "lucide-react"
import ModalConfirmation from "./ModalConfirmation"

const FINISH = "FINISH"
const CANCEL = "CANCEL"

interface ITodayAppointment {
    id: number
    scheduledAt: string
    endsAt: string,
    procedure: string
    patient: { name: string }
}

interface ITodaysAppointments {
    id: number
    name: string
    appointments: ITodayAppointment[]
}

type ModalAction = typeof FINISH | typeof CANCEL

interface IModal {
    isOpen: boolean,
    type: ModalAction | null
    content: ITodayAppointment | null
}

export default function Resume() {
    const [todaysAppointments, setTodaysAppointments] = useState<ITodaysAppointments[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [modal, setModal] = useState<IModal>({
        isOpen: false,
        type: null,
        content: null
    })

    function handleOpenModal(appointment: ITodayAppointment, typeClick: ModalAction) {
        setModal({ content: appointment, isOpen: true, type: typeClick })
    }

    function handleCloseModal() {
        setModal(({ isOpen: false, type: null, content: null }))
    }

    function handleModalAction(action: ModalAction) {
        if (modal.content) handleAppointmentAction(action, modal.content.id)
        handleCloseModal()
    }

    async function handleAppointmentAction(action: ModalAction, id: number) {
        setIsLoading(true)

        try {
            const endpoint = action === FINISH ? "/api/completed-appointment" : "/api/cancelled-appointment"

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })

            if (!response.ok) throw new Error(`Falha ao ${action === FINISH ? "finalizar" : "cancelar"} consulta`)

            toast.success(`Consulta ${action === FINISH ? "finalizada" : "cancelada"} com sucesso!`)

            setTodaysAppointments(prev => {
                if (!prev) return null

                // Filtra os dentistas mantendo apenas os que tem consultas
                const updatedAppointments = prev
                    .map(dentist => ({
                        ...dentist,
                        appointments: dentist.appointments.filter(app => app.id !== id)
                    }))
                    .filter(dentist => dentist.appointments.length > 0) // Remove dentistas sem consultas

                return updatedAppointments.length > 0 ? updatedAppointments : null
            })
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchAppointments = useCallback(async () => {
        setIsLoading(true)

        try {
            const response = await fetch("/api/todays-appointments", {
                method: "GET"
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Não foi possível buscar as consultas de hoje")

            setTodaysAppointments(data)
        } catch (error: any) {
            setError(error instanceof Error ? error.message : "Erro desconhecido")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    return (
        <section className={styles.content}>

            {/* Cabeçalho */}
            <div className={styles.header}>
                <h3>Dentista</h3>
                <h3 className={styles.appointments}>Consultas</h3>
                <button onClick={fetchAppointments}><RefreshCw className={`${isLoading && styles.rotateSpinner}`} /> Atualizar</button>
            </div>

            {/* Consultas de hoje */}
            <div className={styles.container}>
                {isLoading ? <p className={styles.loading}><Spinner /> Carregando</p>
                    : error ? <p className={styles.error}>Erro: {error}</p>
                        : !todaysAppointments ? <p className={styles.notFound}>Não foi possível encontrar os dados das Consultas</p>
                            : (
                                todaysAppointments.length === 0 ? <p className={styles.noAppointments}>Nenhuma consulta para hoje</p> : (
                                    todaysAppointments.map(item => (
                                        <div key={item.id} className={styles.timeline} data-testid="timeline">
                                            <DentistCard dentistName={item.name} />
                                            {item.appointments.map((appointment, index, array) =>
                                                <AppointmentCard
                                                    key={appointment.id}
                                                    patientName={appointment.patient.name}
                                                    procedure={appointment.procedure}
                                                    start={appointment.scheduledAt}
                                                    end={appointment.endsAt}
                                                    onClickFinish={() => handleOpenModal(appointment, FINISH)}
                                                    onClickCancel={() => handleOpenModal(appointment, CANCEL)}
                                                    isLast={index === array.length - 1}
                                                />
                                            )}
                                        </div>
                                    ))
                                )
                            )}
            </div>

            {/* Modal de confirmação */}
            {modal.isOpen && modal.content && (
                <ModalConfirmation 
                    appointment={modal.content} 
                    onCancel={handleCloseModal} 
                    onConfirm={type => handleModalAction(type)}
                    type={modal.type!}
                />
            )}

            {/* Mensagens de notificação */}
            <Toaster />
        </section>
    )
}