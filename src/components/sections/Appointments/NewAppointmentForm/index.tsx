'use client'

import React, { useState } from "react"
import styles from "./styles.module.scss"
import PatientCPFView from "./PatientCPFView"
import ProcedureView from "./ProcedureView"
import DentistView from "./DentistView"
import ScheduledView from "./ScheduledView"
import { formatHour } from "@/utils/formatHour"
import { formatDateISO } from "@/utils/formatDateISO"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, CalendarPlus } from "lucide-react"
import Card from "@/components/ui/Card"
import Spinner from "@/components/ui/Spinner"
import SectionWrapper from "@/components/layout/SectionWrapper"

const PATIENT_VIEW = "PATIENT_VIEW"
const PROCEDURE_VIEW = "PRECEDURE_VIEW"
const DENTIST_VIEW = "DENTIST_VIEW"
const SCHEDULED_VIEW = "SCHEDULED_VIEW"
const CONFIRM_APPOINTMENT_VIEW = "CONFIRM_APPOINTMENT_VIEW"
const COMPLETED_APPOINTMENT_VIEW = "COMPLETED_APPOINTMENT_VIEW"

interface IFormData {
    patientName: string | null
    patientId: number | null
    dentistName: string | null
    dentistId: number | null
    scheduledAt: string | null
    endsAt: string | null
    durationMinutes: number | null
    procedure: string | null
}

export default function NewAppointmentForm() {
    const [currentView, setCurrentView] = useState<string>(PATIENT_VIEW)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<IFormData>({
        patientName: null,
        patientId: null,
        dentistName: null,
        dentistId: null,
        scheduledAt: null,
        endsAt: null,
        durationMinutes: null,
        procedure: null
    })

    // Importante para a reenderização dos componentes, pois reseta os estados internos ao alterar a key.
    const [childsKey, setChildsKey] = useState({
        patientCPFView: 1,
        procedureView: 2,
        dentistView: 3,
        scheduledView: 4,
        confirmAppointmentView: 5,
        completedAppointmentView: 6
    })

    function handleNext() {
        if (currentView === PATIENT_VIEW) {
            setCurrentView(PROCEDURE_VIEW)
        } else if (currentView === PROCEDURE_VIEW) {
            setCurrentView(DENTIST_VIEW)
        } else if (currentView === DENTIST_VIEW) {
            setCurrentView(SCHEDULED_VIEW)
        } else if (currentView === SCHEDULED_VIEW) {
            setCurrentView(CONFIRM_APPOINTMENT_VIEW)
        } else if (currentView === CONFIRM_APPOINTMENT_VIEW) {
            setFormData({
                patientName: null,
                patientId: null,
                dentistName: null,
                dentistId: null,
                scheduledAt: null,
                endsAt: null,
                durationMinutes: null,
                procedure: null
            })
            setCurrentView(COMPLETED_APPOINTMENT_VIEW)
        } else if (currentView === COMPLETED_APPOINTMENT_VIEW) {
            setChildsKey(prev => ({
                patientCPFView: prev.patientCPFView + 1,
                dentistView: prev.dentistView + 1,
                procedureView: prev.procedureView + 1,
                scheduledView: prev.scheduledView + 1,
                confirmAppointmentView: prev.confirmAppointmentView + 1,
                completedAppointmentView: prev.completedAppointmentView + 1
            }))
            setCurrentView(PATIENT_VIEW)
        }
    }

    function handleBack() {
        if (currentView === PROCEDURE_VIEW) {
            setCurrentView(PATIENT_VIEW)
        } else if (currentView === DENTIST_VIEW) {
            setCurrentView(PROCEDURE_VIEW)
        } else if (currentView === SCHEDULED_VIEW) {
            setCurrentView(DENTIST_VIEW)
        } else if (currentView === CONFIRM_APPOINTMENT_VIEW) {
            setCurrentView(SCHEDULED_VIEW)
        }
    }

    async function handleSubmitAppointment() {
        setIsLoading(true)
        // Separa apenas as informações necessárias para criação da consulta em "...apointment"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { patientName, dentistName, ...appointment } = formData
        try {

            const response = await fetch("/api/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointment)
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro desconhecido")
            handleNext()
        } catch (error) {
            alert(JSON.stringify(error))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SectionWrapper title="Agendar Nova Consulta">
            <>
                {/* Escolha do Paciente */}
                <PatientCPFView
                    patient={patient => patient ?
                        setFormData(prev => ({ ...prev, patientId: patient.id, patientName: patient.name })) :
                        setFormData(prev => ({ ...prev, patientId: null, patientName: null }))}
                    onNext={handleNext}
                    visible={currentView === PATIENT_VIEW}
                    key={childsKey.patientCPFView}
                />

                {/* Escolha do Procedimento */}
                <ProcedureView
                    onSelectProcedure={e => setFormData(prev => ({ ...prev, procedure: e.procedure, durationMinutes: e.durationMinutes }))}
                    onBack={handleBack}
                    onNext={handleNext}
                    active={currentView === PROCEDURE_VIEW}
                    key={childsKey.procedureView}
                />

                {/* Escolha do Dentista */}
                <DentistView
                    procedure={formData.procedure}
                    dentistId={id => setFormData(prev => ({ ...prev, dentistId: id }))}
                    dentistName={name => setFormData(prev => ({ ...prev, dentistName: name }))}
                    onBack={handleBack}
                    onNext={handleNext}
                    visible={currentView === DENTIST_VIEW}
                    key={childsKey.dentistView}
                />

                {/* Escolha do Horário */}
                <ScheduledView
                    durationMinutes={formData.durationMinutes}
                    dentistId={formData.dentistId}
                    scheduledAt={schduledAt => setFormData(prev => ({ ...prev, scheduledAt: schduledAt }))}
                    endsAt={endsAt => setFormData(prev => ({ ...prev, endsAt: endsAt }))}
                    onBack={handleBack}
                    onNext={handleNext}
                    active={currentView === SCHEDULED_VIEW}
                    key={childsKey.scheduledView}
                />

                {/* Confirmação do Agendamento */}
                <div key={childsKey.confirmAppointmentView} className={`${styles.confirmAppointmentView} ${currentView === CONFIRM_APPOINTMENT_VIEW && styles.active}`}>
                    <Card width="max-content" height="max-content">
                        <>
                            <Label text="Informações do Agendamento" />
                            <p>Paciente: <span>{formData.patientName}</span></p>
                            <p>Procedimento: <span>{formData.procedure}</span></p>
                            <p>Dentista: <span>Dr. {formData.dentistName}</span></p>
                            <p>Dia: <span>{formatDateISO(formData.scheduledAt!)}</span></p>
                            <p>Horário: <span>{formatHour(formData.scheduledAt!)} - {formatHour(formData.endsAt!)}</span></p>
                            <p>Duração: <span>{formData.durationMinutes} Minutos</span></p>
                        </>
                    </Card>
                    <div className={styles.boxBtns}>
                        <Button onClick={handleBack} text="Voltar" iconStart={<ArrowLeft />} />
                        <Button onClick={handleSubmitAppointment} text="Agendar" iconStart={<CalendarPlus />} disabled={isLoading} />
                        {isLoading && <Spinner className={styles.spinner} />}
                    </div>
                </div>

                {/* Ao confirmar o Agendamento */}
                <div key={childsKey.completedAppointmentView} className={`${styles.success} ${currentView === COMPLETED_APPOINTMENT_VIEW && styles.active}`}>
                    <h2>Agendamento realizado com sucesso!</h2>
                    <button onClick={handleNext}>OK</button>
                </div>
            </>
        </SectionWrapper>
    )
}