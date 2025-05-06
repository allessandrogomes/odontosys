/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"
import { IMaskInput } from "react-imask"
import styles from "./styles.module.scss"
import Image from "next/image"

export default function Home() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    login: "",
    password: ""
  })

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: formData.login,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro inesperado no login")
      }

      if (data.user.role === "DENTISTA") {
        router.push("/dentist-dashboard")
      } else {
        router.push("/receptionist-dashboard")
      }

    } catch (error: any) {
      setError(error.message)
      setFormData({ login: "", password: "" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit} className={styles.login}>
        <Image className={styles.logo} src="/images/logo.webp" width={500} height={500} alt="Logo OdontoSys" />
        <h1>Faça seu login</h1>
        <div className={styles.fields}>
          <div className={styles.labelInput}>
            <label>CPF</label>
            <IMaskInput
              mask="000.000.000-00"
              value={formData.login}
              onAccept={(value) => setFormData({ ...formData, login: value })}
              overwrite
              minLength={14}
              required
            />
          </div>
          <div className={styles.labelInput}>
            <label>Senha</label>
            <input type="password" onChange={e => setFormData({ ...formData, password: e.target.value })} value={formData.password} required/>
          </div>
        </div>
        {!loading ? <button disabled={loading} type="submit">Entrar</button> : <Loader className={styles.spinner} />}
        {error && <span>{error}</span>}
      </form>
    </div>
  )
}
