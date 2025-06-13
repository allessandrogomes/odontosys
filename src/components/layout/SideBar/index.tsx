import styles from "./styles.module.scss"
import { IoMdHome } from "react-icons/io"
import { FaCalendarAlt } from "react-icons/fa"
import { FaRegUser } from "react-icons/fa"
import { TbReportAnalytics } from "react-icons/tb"
import { useState } from "react"
import Image from "next/image"

type SidebarButton = {
    icon: React.ReactElement
    type: string
    component?: DashboardComponent[]
}

const sidebarBtns: SidebarButton[] = [
    { icon: <IoMdHome className={styles.icon} />, type: "Início", component: ["Resumo"] },
    { icon: <FaCalendarAlt className={styles.icon} />, type: "Agendamentos", component: ["Buscar Consulta", "Nova Consulta", "Alterar Consulta"] },
    { icon: <FaRegUser className={styles.icon} />, type: "Pacientes", component: ["Pesquisar", "Cadastrar", "Editar Informações"] },
    { icon: <TbReportAnalytics className={styles.icon} />, type: "Relatórios" }
]

const selectedStyle = {
    backgroundColor: "var(--primary-color)",
    color: "var(--secondary-color)"
}

type DashboardComponent =
    | "Resumo"
    | "Nova Consulta"
    | "Alterar Consulta"
    | "Buscar Consulta"
    | "Pesquisar"
    | "Cadastrar"
    | "Editar Informações"

interface ISideBar {
    dashboardSelected: (selected: { type: string, component: DashboardComponent }) => void
}

export default function SideBar({ dashboardSelected }: ISideBar) {
    const [openMenu, setOpenMenu] = useState<string | null>("Início")
    const [menuItemSelected, setMenuItemSelected] = useState<string | null>("Início")
    const [submenuItemSelected, setSubmenuItemSelected] = useState<string | null>("Resumo")

    function toggleMenu(type: string) {
        setOpenMenu(prev => (prev === type ? null : type))
    }

    function handleSelect(component: DashboardComponent, type: string) {
        setSubmenuItemSelected(component)
        dashboardSelected({ type, component })
    }

    return (
        <aside className={styles.aside}>
            <div className={styles.logo}>
                <Image className={styles.image} src="/images/logo.webp" width={500} height={500} alt="Logo OdontoSys" />
            </div>
            <nav>
                <ul>
                    {sidebarBtns.map(btn => (
                        <li onClick={() => setMenuItemSelected(btn.type)} key={btn.type} className={styles.menu}>
                            <div style={menuItemSelected === btn.type ? selectedStyle : {}} className={styles.menuItem} onClick={() => toggleMenu(btn.type)}>
                                {btn.icon}
                                <h3>{btn.type}</h3>
                            </div>

                            {/* Se tiver filhos e o menu estiver aberto */}
                            {btn.component && openMenu === btn.type && (
                                <ul className={styles.submenu}>
                                    {btn.component.map((component, index) => (
                                        <li onClick={() => handleSelect(component, btn.type)} style={submenuItemSelected === component ? selectedStyle : {}} key={index} className={styles.submenuItem}>
                                            {component}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}