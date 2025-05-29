/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import AppointmentCard from "./AppointmentCard"
import DentistCard from "./DentistCard"
import styles from "./styles.module.scss"
import { formatHour } from "@/utils/formatHour"
import { Toaster, toast } from "react-hot-toast"
import { FaCheck } from "react-icons/fa"
import { FaXmark } from "react-icons/fa6"
import Spinner from "@/components/shared/Spinner"
import { RefreshCw } from "lucide-react"

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

export default function Resume() {
    const [todaysAppointments, setTodaysAppointments] = useState<ITodaysAppointments[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [typeModal, setTypeModal] = useState<string | null>(null)
    const [contentModal, setContentModal] = useState<ITodayAppointment | null>(null)

    function handleOpenModal(appointment: ITodayAppointment, typeClick: string) {
        if (typeClick === "finish") {
            setTypeModal("Finalizar")
        } else if (typeClick === "cancel") {
            setTypeModal("Cancelar")
        }
        setContentModal(appointment)
        setModalIsOpen(true)
    }

    function handleModalAction(action: string | null) {
        if (action === "Finalizar" && contentModal) {
            completeAppointemnt(contentModal.id)
        } else if (action === "Cancelar" && contentModal) {
            cancellAppointemnt(contentModal.id)
        }
        handleCloseModal()
    }

    function handleCloseModal() {
        setContentModal(null)
        setTypeModal(null)
        setModalIsOpen(false)
    }

    async function completeAppointemnt(id: number) {
        setIsLoading(true)

        try {
            const response = await fetch("/api/completed-appointment", {
                method: "POST",
                body: JSON.stringify({
                    id: id
                })
            })

            if (!response.ok) throw new Error("Consulta não finalizada, tente novamente")

            toast.success("Consulta finalizada com sucesso!")
        } catch (error: any) {
            toast.error(error)
        } finally {
            await fetchAppointments()
        }
    }

    async function cancellAppointemnt(id: number) {
        setIsLoading(true)

        try {
            const response = await fetch("/api/cancelled-appointment", {
                method: "POST",
                body: JSON.stringify({
                    id: id
                })
            })

            if (!response.ok) throw new Error("Consulta não cancelada, tente novamente")

            toast.success("Consulta cancelada com sucesso!")
        } catch (error: any) {
            toast.error(error)
        } finally {
            await fetchAppointments()
        }
    }

    async function fetchAppointments() {
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
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    return (
        <section className={styles.content}>

            {/* Cabeçalho */}
            <div className={styles.header}>
                <h3>Dentista</h3>
                <h3 className={styles.appointments}>Consultas</h3>
                <button onClick={fetchAppointments}><RefreshCw className={`${isLoading && styles.rotateSpinner}`}/> Atualizar</button>
            </div>

            {/* Consultas de hoje */}
            <div className={styles.container}>
                {isLoading ? <p className={styles.loading}><Spinner /> Carregando</p>
                    : error ? <p className={styles.error}>Erro: {error}</p>
                        : !todaysAppointments ? <p className={styles.notFound}>Não foi possível encontrar os dados das Consultas</p>
                            : (
                                todaysAppointments.length === 0 ? <p className={styles.noAppointments}>Nenhuma consulta para hoje</p> : (
                                    todaysAppointments.map(item => (
                                        <div key={item.id} className={styles.timeline}>
                                            <DentistCard dentistName={item.name} />
                                            {item.appointments.map((appointment, index, array) =>
                                                <AppointmentCard
                                                    key={appointment.id}
                                                    patientName={appointment.patient.name}
                                                    procedure={appointment.procedure}
                                                    start={appointment.scheduledAt}
                                                    end={appointment.endsAt}
                                                    onClickFinish={() => handleOpenModal(appointment, "finish")}
                                                    onClickCancel={() => handleOpenModal(appointment, "cancel")}
                                                    isLast={index === array.length -1}
                                                />
                                            )}
                                        </div>
                                    ))
                                )
                            )}
            </div>

            {/* Modal de confirmação */}
            {modalIsOpen && contentModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Deseja {typeModal} essa consulta?</h2>
                        <p>Paciente: <span>{contentModal.patient.name}</span></p>
                        <p>Procedimento: <span>{contentModal.procedure}</span></p>
                        <p>Horário: <span>{formatHour(contentModal.scheduledAt)} - {formatHour(contentModal.endsAt)}</span></p>
                        <div className={styles.btns}>
                            <button className={`${typeModal === "Finalizar" ? styles.finishBtn : styles.cancelBtn}`} onClick={() => handleModalAction(typeModal)}>{typeModal === "Finalizar" ? <FaCheck className={styles.finishIcon}/> : <FaXmark className={styles.cancelIcon}/>} {typeModal}</button>
                            <button className={styles.backBtn} onClick={handleCloseModal}>Voltar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensagens de notificação */}
            <Toaster />
        </section>
    )
}