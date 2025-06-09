'use client'

import styles from "./styles.module.scss"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
            <SideBar dashboardSelected={dashboard => setDashboardToShow(dashboard)} />

            {/* Início */}
            <div className={styles.content}>
                <Header title={dashboardToShow} onLogout={handleLogout} receptionist={user.name || "Nome do recepcionsta não encontrado"} />
                <MainLayout>
                    <>
                        {dashboardToShow === "Resumo" && <Resume />}
                        {dashboardToShow === "Nova Consulta" && <NewAppointmentForm />}
                        {dashboardToShow === "Alterar Consulta" && <RescheduleAppointment />}
                        {dashboardToShow === "Buscar Consulta" && <SearchAppointment />}
                        {dashboardToShow === "Pesquisar" && <Search />}
                        {dashboardToShow === "Cadastrar" && <RegisterPatient />}
                        {dashboardToShow === "Editar informações" && <EditInformations />}
                    </>
                </MainLayout>
            </div>
            {/* Início */}
        </div>
    )
}