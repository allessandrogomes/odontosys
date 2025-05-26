/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react"
import styles from "./styles.module.scss"
import { IMaskInput } from "react-imask"
import toast, { Toaster } from "react-hot-toast"
import { Save } from "lucide-react"
import { FaArrowLeft } from "react-icons/fa"
import Button from "@/components/shared/Button"
import Spinner from "@/components/shared/Spinner"

interface IEditForm {
    patient: IPatient | null
    onBack: (onBack: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onSuccess: () => void
}

export default function EditForm({ patient, onBack, onSuccess }: IEditForm) {
    const [formData, setFormData] = useState({
        name: patient?.name,
        email: patient?.email,
        phone: patient?.phone,
        cpf: patient?.cpf,
        birthDate: patient?.birthDate
    })

    const updatedData = {
        id: patient?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone?.replace(/\D/g, ""),
        createdAt: patient?.createdAt,
        cpf: formData.cpf?.replace(/\D/g, ""),
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
            <button type="button" onClick={onBack} className={styles.backBtn}><FaArrowLeft />Voltar</button>
            <form onSubmit={handleSubmitUpdate} className={styles.form}>
                <div>
                    <label>Nome Completo</label>
                    <IMaskInput
                        mask={/^[A-Za-zÀ-ÿ\s]*$/}
                        value={formData.name}
                        onAccept={(value) => setFormData(prev => ({ ...prev, name: value }))}
                        overwrite
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Telefone</label>
                    <IMaskInput
                        mask="(00) 00000-0000"
                        value={formData.phone}
                        onAccept={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                        overwrite
                        minLength={15}
                        required
                    />
                </div>
                <div>
                    <label>CPF</label>
                    <IMaskInput
                        mask="000.000.000-00"
                        value={formData.cpf}
                        onAccept={(value) => setFormData(prev => ({ ...prev, cpf: value }))}
                        overwrite
                        minLength={14}
                        required
                    />
                </div>
                <div>
                    <label>Data de Nascimento</label>
                    <input type="date" name="birthDate" value={formData.birthDate ? formData.birthDate.substring(0, 10) : ""} onChange={handleChange} />
                </div>

                {isLoading ? (
                    <div className={styles.spinner}><Spinner /></div>
                ) : (
                    <Button type="submit" disabled={thereWasNoChange} icon={<Save />} text="Salvar"/>
                )}
            </form>
            <Toaster />
        </div>
    )
}