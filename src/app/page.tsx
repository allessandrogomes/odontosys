'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [formData, setFormData] = useState({
    login: "",
    password: ""
  })

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

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
      alert(data.error || "Erro ao fazer o login")
    } else {
      router.push("/dentist-dashboard")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Login</label>
        <input type="text"  onChange={e => setFormData({ ...formData, login: e.target.value })} value={formData.login}/>
        <label>Senha</label>
        <input type="password" onChange={e => setFormData({ ...formData, password: e.target.value })} value={formData.password}/>
        <button type="submit">Entrar</button>
      </form>
    </>
  )
}
