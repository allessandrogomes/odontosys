/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {  useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { IMaskInput } from "react-imask"
import styles from "./styles.module.scss"
import Image from "next/image"
import Spinner from "@/components/ui/Spinner"
import { lastUpdate } from "@/lastUpdate"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"

interface IFormData {
  login: string
  password: string
}

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<IFormData>({ login: "", password: "" })
  const loginAttemptsRef = useRef(0)

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (loginAttemptsRef.current >= 3) {
      setError("Muitas tentativas. Tente mais tarde.")
      return
    }

    setIsLoading(true)
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
      if (!response.ok) throw new Error(data.error || "Erro inesperado no login")

      // Reset das tentativas após sucesso
      loginAttemptsRef.current = 0

      if (data.user.role === "DENTISTA") {
        router.push("/dentist-dashboard")
      } else {
        router.push("/receptionist-dashboard")
      }
    } catch (error: any) {
      loginAttemptsRef.current += 1 // Incrementa o contador
      setError(error.message)
      setFormData({ login: "", password: "" })
      setIsLoading(false)
    }
  }

  const formatted = format(new Date(lastUpdate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <div className={styles.login}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Image className={styles.logo} src="/images/logo.webp" width={500} height={500} alt="Logo OdontoSys" priority />

        <h1>Faça seu login</h1>

        <div className={styles.fields}>
          <div className={styles.labelInput}>
            <label htmlFor="cpfInput">CPF</label>
            <IMaskInput
              id="cpfInput"
              mask="000.000.000-00"
              value={formData.login}
              onAccept={(value) => setFormData({ ...formData, login: value })}
              overwrite
              minLength={14}
              required
            />
          </div>
          <div className={styles.labelInput}>
            <label htmlFor="passwordInput">Senha</label>
            <input id="passwordInput" type="password" onChange={e => setFormData({ ...formData, password: e.target.value })} value={formData.password} required />
          </div>
        </div>

        {!isLoading ? <button disabled={isLoading} type="submit">Entrar</button> : <Spinner className={styles.spinner} />}
        {error && <span role="alert">{error}</span>}
      </form>
      <div className={styles.infosLogin}>
        <span>Informações de Login para teste</span>
        <span>Login: 87590814333</span>
        <span>Senha: Teste123*</span>
        <span>Última atualização: {formatted}</span>
      </div>
    </div>
  )
}
