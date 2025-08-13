/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react"
import styles from "./styles.module.scss"
import toast, { Toaster } from "react-hot-toast"
import BackBtn from "@/components/ui/BackBtn"
import PatientInformationForm from "@/components/forms/PatientInformationForm"
import { Save } from "lucide-react"

interface IEditForm {
    patient: IPatient
    onBack: (onBack: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onSuccess: () => void
}

interface IFormData {
    name: string,
    email: string,
    phone: string,
    cpf: string,
    birthDate: string
}

export default function EditForm({ patient, onBack, onSuccess }: IEditForm) {
    // Campos do formulário
    const [formData, setFormData] = useState<IFormData>({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        cpf: patient.cpf,
        birthDate: patient.birthDate
    })

    // Dados completos alterados para comparar com o "patient" inicial, na const "thereWasNoChange"
    const updatedData = {
        id: patient.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ""),
        createdAt: patient.createdAt,
        cpf: formData.cpf.replace(/\D/g, ""),
        birthDate: formData.birthDate
    }

    const [isLoading, setIsLoading] = useState(false)
    const thereWasNoChange = JSON.stringify(patient) === JSON.stringify(updatedData)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target

        let parsedValue: string = value

        if (name === "birthDate") {
            const date = new Date(value)
            const isValid = !isNaN(date.getTime())
            parsedValue = isValid ? date.toISOString() : value
        }

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }))
    }

    function handleMaskedChange(name: keyof IFormData, value: string) {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmitUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`/api/patient/id/${patient!.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao atualizar dos do paciente")

            onSuccess()
        } catch (error: any) {
            toast.error(error.message || "Não foi possível atualizar os dados, tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.editInfo}>
            <BackBtn onClick={onBack} />
            <PatientInformationForm 
                formData={formData} 
                isLoading={isLoading} 
                onChange={handleChange} 
                onMaskInputChange={handleMaskedChange}
                onSubmit={handleSubmitUpdate}
                disabled={thereWasNoChange}
                submitBtnIcon={<Save />}
                submitBtnText="Salvar"
            />
            <Toaster />
        </div>
    )
}