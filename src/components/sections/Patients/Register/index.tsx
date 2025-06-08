/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react"
import styles from "./styles.module.scss"
import { IMaskInput } from "react-imask"
import toast, { Toaster } from "react-hot-toast"
import { UserPlus } from "lucide-react"
import Button from "@/components/ui/Button"
import Spinner from "@/components/ui/Spinner"

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
            <form onSubmit={handleSubmit} className={styles.form}>
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
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
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
                    <Button type="submit" iconStart={<UserPlus />} text="Cadastrar"/>
                )}
            </form>
            <Toaster />
        </div>
    )
}