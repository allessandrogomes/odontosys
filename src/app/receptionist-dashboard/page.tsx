'use client'

import styles from "./styles.module.scss"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardSideBar from "@/components/DashboardSideBar"
import DashboardHeader from "@/components/DashboardHeader"
import NewAppointmentForm from "@/components/DashboardContent/Appointments/NewAppointmentForm"
import Resume from "@/components/DashboardContent/Home/Resume"
import RescheduleAppointment from "@/components/DashboardContent/Appointments/ChangeAppointment"
import DashboardContent from "@/components/DashboardContent"
import SearchAppointment from "@/components/DashboardContent/Appointments/SearchAppointment"
import RegisterPatient from "@/components/DashboardContent/Patients/Register"
import Search from "@/components/DashboardContent/Patients/Search"

export default function ReceptionistDashboard() {
    const [user, setUser] = useState<IReceptionist | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const [dashboardToShow, setDashboardToShow] = useState<string>("Resumo")

    const handleLogout = async () => {
        try {
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

    if (isLoading) return <p>Carregando...</p>
    if (error) return <p>Erro: {error}</p>
    if (!user) return <p>Não foi possível carregar os dados do usuário</p>

    return (
        <div className={styles.dashboard}>
            <DashboardSideBar dashboardSelected={dashboard => setDashboardToShow(dashboard)} />

            {/* Início */}
            <div className={styles.content}>
                <DashboardHeader title={dashboardToShow} onLogout={handleLogout} receptionist={user.name || "Nome do recepcionsta não encontrado"} />
                <DashboardContent>
                    <>
                        {dashboardToShow === "Resumo" && <Resume />}
                        {dashboardToShow === "Nova Consulta" && <NewAppointmentForm />}
                        {dashboardToShow === "Cadastrar" && <RegisterPatient />}
                        {dashboardToShow === "Alterar Consulta" && <RescheduleAppointment />}
                        {dashboardToShow === "Buscar Consulta" && <SearchAppointment />}
                        {dashboardToShow === "Pesquisar" && <Search />}
                    </>
                </DashboardContent>
            </div>
            {/* Início */}
        </div>
    )
}