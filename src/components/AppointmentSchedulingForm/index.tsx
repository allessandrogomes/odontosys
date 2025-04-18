'use client'

import { useState } from "react"
import styles from "./styles.module.scss"
import PatientCPFView from "./PatientCPFView"

const PATIENT_VIEW = "PATIENT_VIEW"
const DENTIST_VIEW = "DENTIST_VIEW"
const PROCEDURE_VIEW = "PRECEDURE_VIEW"

interface IFormData {
    patientId: number | null
    dentistId: number | null
    scheduledAt: string | null
    endsAt: string | null
    durationMinutes: number | null
    procedure: string | null
}

export default function AppointmentSchedulingForm() {
    const [currentView, setCurrentView] = useState(PATIENT_VIEW)
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
            setCurrentView(DENTIST_VIEW)
        } else if (currentView === DENTIST_VIEW) {
            setCurrentView(PROCEDURE_VIEW)
        }
    }

    return (
        <div className={styles.form}>
            <h3>Agendamento de Consulta</h3>
            <p>{JSON.stringify(formData)}</p>
            {currentView === PATIENT_VIEW && (
                <>
                    <PatientCPFView onSelectPatientId={id => setFormData(prev => ({ ...prev, patientId: id }))} />
                    <button onClick={handleNext} disabled={currentView === PATIENT_VIEW && !formData.patientId}>Próximo</button>
                </>
            )}

            {currentView === DENTIST_VIEW && (
                <>
                    <p>Selecionar dentista</p>
                    <button>Próximo</button>
                </>
            )}
        </div>
    )
}