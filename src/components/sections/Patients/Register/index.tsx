/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react"
import styles from "./styles.module.scss"
import toast, { Toaster } from "react-hot-toast"
import PatientInformationForm from "@/components/forms/PatientInformationForm"
import { UserPlus } from "lucide-react"

interface IFormData {
    name: string,
    email: string,
    phone: string,
    cpf: string,
    birthDate: string
}

export default function RegisterPatient() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        cpf: "",
        birthDate: ""
    })

    const [isLoading, setIsLoading] = useState(false)

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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/patient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao cadastrar Paciente")

            setFormData({
                name: "",
                email: "",
                phone: "",
                cpf: "",
                birthDate: ""
            })
            toast.success("Cadastro realizado com sucesso!")
        } catch (error: any) {
            toast.error(error.message || "Não foi possível realizar o cadastro, tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.registerPatient}>
            <h2>Cadastro de Paciente</h2>
            <PatientInformationForm
                formData={formData}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onChange={handleChange}
                onMaskInputChange={handleMaskedChange}
                submitBtnIcon={<UserPlus />}
                submitBtnText="Cadastrar"
            />
            <Toaster />
        </div>
    )
}