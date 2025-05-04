'use client'

import { useState } from "react"
import styles from "./styles.module.scss"
import PatientCPFView from "./PatientCPFView"
import ProcedureView from "./ProcedureView"
import DentistView from "./DentistView"
import ScheduledView from "./ScheduledView"

const PATIENT_VIEW = "PATIENT_VIEW"
const DENTIST_VIEW = "DENTIST_VIEW"
const PROCEDURE_VIEW = "PRECEDURE_VIEW"
const SCHEDULED_VIEW = "SCHEDULED_VIEW"
const SCHEDULING_COMPLETED_VIEW = "SCHEDULING_COMPLETED_VIEW"

interface IFormData {
    patientId: number | null
    dentistId: number | null
    scheduledAt: string | null
    endsAt: string | null
    durationMinutes: number | null
    procedure: string | null
}

export default function AppointmentSchedulingForm() {
    const [currentView, setCurrentView] = useState<string>(PATIENT_VIEW)
    const [formData, setFormData] = useState<IFormData>({
        patientId: null,
        dentistId: null,
        scheduledAt: null,
        endsAt: null,
        durationMinutes: null,
        procedure: null
    })

    function handleNext() {
        if (currentView === PATIENT_VIEW) {
            setCurrentView(PROCEDURE_VIEW)
        } else if (currentView === PROCEDURE_VIEW) {
            setCurrentView(DENTIST_VIEW)
        } else if (currentView === DENTIST_VIEW) {
            setCurrentView(SCHEDULED_VIEW)
        } else if (currentView === SCHEDULED_VIEW) {
            setCurrentView(SCHEDULING_COMPLETED_VIEW)
        } else if (currentView === SCHEDULING_COMPLETED_VIEW) {
            setFormData({
                patientId: null,
                dentistId: null,
                scheduledAt: null,
                endsAt: null,
                durationMinutes: null,
                procedure: null
            })
            setCurrentView(PATIENT_VIEW)
        }
    }

    function handleBack() {
        if (currentView === PROCEDURE_VIEW) {
            setCurrentView(PATIENT_VIEW)
        } else if (currentView === DENTIST_VIEW) {
            setCurrentView(PROCEDURE_VIEW)
        }
    }

    async function handleSubmitAppointment() {
        try {
            const response = await fetch("/api/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            alert(JSON.stringify(data))
        } catch (error) {
            alert(JSON.stringify(error))
        } finally {
            handleNext()
        }
    }

    return (
        <div className={styles.form}>
            <h1 className={styles.title}>Agendamento de Consulta</h1>

            {/* Escolha do Paciente */}
            <PatientCPFView
                onSelectPatientId={id => setFormData(prev => ({ ...prev, patientId: id }))}
                onNext={handleNext}
                active={currentView === PATIENT_VIEW}
            />

            {/* Escolha do Procedimento */}
            <ProcedureView
                onSelectProcedure={e => setFormData(prev => ({ ...prev, procedure: e.procedure, durationMinutes: e.durationMinutes }))}
                onBack={handleBack}
                onNext={handleNext}
                active={currentView === PROCEDURE_VIEW}
            />

            {/* Escolha do Dentista */}
            <DentistView
                procedure={formData.procedure}
                dentistId={id => setFormData(prev => ({ ...prev, dentistId: id }))}
                onBack={handleBack}
                onNext={handleNext}
                active={currentView === DENTIST_VIEW}
            />

            {currentView === SCHEDULED_VIEW && (
                <>
                    <ScheduledView
                        durationMinutes={formData.durationMinutes}
                        dentistId={formData.dentistId}
                        scheduledAt={schduledAt => setFormData(prev => ({ ...prev, scheduledAt: schduledAt }))}
                        endsAt={endsAt => setFormData(prev => ({ ...prev, endsAt: endsAt }))}
                    />
                    <button onClick={handleSubmitAppointment} disabled={!formData.scheduledAt}>Agendar Consulta</button>
                </>
            )}

            {currentView === SCHEDULING_COMPLETED_VIEW && (
                <>
                    <h3>Agendamento Realizado!</h3>
                    <button onClick={handleNext}>Agendar nova consulta</button>
                </>
            )}
        </div>
    )
}