'use client'

import styles from "./styles.module.scss"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import SideBar from "@/components/layout/SideBar"
import NewAppointmentForm from "@/components/sections/Appointments/NewAppointmentForm"
import Resume from "@/components/sections/Home/Resume"
import RescheduleAppointment from "@/components/sections/Appointments/ChangeAppointment"
import SearchAppointment from "@/components/sections/Appointments/SearchAppointment"
import RegisterPatient from "@/components/sections/Patients/Register"
import Search from "@/components/sections/Patients/Search"
import EditInformations from "@/components/sections/Patients/EditInformations"
import MainLayout from "@/components/layout/MainLayout"
import Header from "@/components/layout/Header"
import Spinner from "@/components/ui/Spinner"

type DashboardComponent =
    | "Resumo"
    | "Nova Consulta"
    | "Alterar Consulta"
    | "Buscar Consulta"
    | "Pesquisar"
    | "Cadastrar"
    | "Editar Informações"

type DashboardState = {
    type: string
    component: DashboardComponent
}

export default function ReceptionistDashboard() {
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
    const [user, setUser] = useState<IReceptionist | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [dashboard, setDashboard] = useState<DashboardState>({
        type: "Início",
        component: "Resumo"
    })
    const router = useRouter()

    const componentMap = {
        "Resumo": Resume,
        "Nova Consulta": NewAppointmentForm,
        "Alterar Consulta": RescheduleAppointment,
        "Buscar Consulta": SearchAppointment,
        "Pesquisar": Search,
        "Cadastrar": RegisterPatient,
        "Editar Informações": EditInformations
    }

    const CurrentComponent = componentMap[dashboard.component]

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            setError(null)

            // Chama a API de logout
            const res = await fetch("/api/logout", {
                method: "POST",
                credentials: "include"
            })

            if (!res.ok) throw new Error("Falha ao fazer o logout")

            // Redireciona para a página de login
            router.push("/")

            // Limpa o estado
            setUser(null)
        } catch (err) {
            setIsLoggingOut(false)
            setError(err instanceof Error ? err.message : "Erro ao sair")
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/me", { credentials: "include" })
                const data = await res.json()

                if (!res.ok) throw new Error(data.error || "Falha ao buscar usuário")

                setUser(data.user)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido")
                // Redireciona ou mostra mensagem de erro
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [])

    if (isLoggingOut) return <div className={styles.feedbackMessage}><p><Spinner /> Saindo...</p></div>
    if (isLoading) return <div className={styles.feedbackMessage}><p><Spinner /> Carregando...</p></div>
    if (error) return <div className={styles.feedbackMessage}><p>Erro: {error}</p></div>
    if (!user) return <div className={styles.feedbackMessage}><p>Não foi possível carregar os dados do usuário</p></div>

    return (
        <div className={styles.dashboard}>
            <SideBar dashboardSelected={dashboard => setDashboard(dashboard)} />

            <div className={styles.content}>
                <Header
                    title={dashboard.type}
                    onLogout={handleLogout}
                    receptionist={user.name || "Nome do recepcionsta não encontrado"}
                />
                <MainLayout>
                    <CurrentComponent />
                </MainLayout>
            </div>
        </div>
    )
}