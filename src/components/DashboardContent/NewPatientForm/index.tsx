/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react"
import styles from "./styles.module.scss"

export default function NewPatientForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        cpf: "",
        birthDate: ""
    })

    const [loading, setLoading] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target

        const parsedValue = name === "birthDate" ? new Date(value).toISOString() : value
        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }))
    }

    async function handleSubmit(e: any) {
        e.preventDefault()

        console.log(formData)

        setLoading(true)

        const response = await fetch("/api/patient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json()
        setLoading(false)

        if (response.ok) {
            alert("Paciente cadastrado com sucesso!")
            setFormData({
                name: "",
                email: "",
                phone: "",
                cpf: "",
                birthDate: ""
            })
        } else {
            alert(data.error || "Erro ao cadastrar paciente")
        }
    }

    return (
        <form onSubmit={e => handleSubmit(e)} className={styles.form}>
            <h3>Cadastro de Paciente</h3>
            <div>
                <label>Nome Completo</label>
                <input name="name" value={formData.name} onChange={handleChange}/>
            </div>
            <div>
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange}/>
            </div>
            <div>
                <label>Telefone</label>
                <input name="phone" value={formData.phone} onChange={handleChange}/>
            </div>
            <div>
                <label>CPF</label>
                <input name="cpf" value={formData.cpf} onChange={handleChange}/>
            </div>
            <div>
                <label>Data de Nascimento</label>
                <input type="date" name="birthDate" value={formData.birthDate ? formData.birthDate.substring(0, 10) : ""} onChange={handleChange}/>
            </div>

            <button disabled={loading} type="submit">{loading ? "Cadastrando..." : "Cadastrar"}</button>
        </form>
    )
}