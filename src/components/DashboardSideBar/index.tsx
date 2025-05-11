import styles from "./styles.module.scss"
import { IoMdHome } from "react-icons/io"
import { FaCalendarAlt } from "react-icons/fa"
import { FaRegUser } from "react-icons/fa"
import { TbReportAnalytics } from "react-icons/tb"
import { useState } from "react"

const sidebarBtns = [
    { icon: <IoMdHome className={styles.icon} />, title: "Início", childrens: ["Resumo"] },
    { icon: <FaCalendarAlt className={styles.icon} />, title: "Agendamentos", childrens: ["Buscar Consulta", "Nova Consulta", "Alterar Consulta"] },
    { icon: <FaRegUser className={styles.icon} />, title: "Pacientes", childrens: ["Pesquisar", "Cadastrar", "Editar informações"] },
    { icon: <TbReportAnalytics className={styles.icon} />, title: "Relatórios" }
]

const selectedStyle = {
    backgroundColor: "var(--primary-color)",
    color: "var(--secondary-color)"
}

export default function DashboardSideBar({ dashboardSelected }: { dashboardSelected: (child: string) => void }) {
    const [openMenu, setOpenMenu] = useState<string | null>("Início")
    const [menuItemSelected, setMenuItemSelected] = useState<string | null>("Início")
    const [submenuItemSelected, setSubmenuItemSelected] = useState<string | null>("Resumo")

    function toggleMenu(title: string) {
        setOpenMenu(prev => (prev === title ? null : title))
    }

    function handleSelect(child: string) {
        setSubmenuItemSelected(child)
        dashboardSelected(child)
    }

    return (
        <aside className={styles.aside}>
            <nav>
                <ul>
                    {sidebarBtns.map(btn => (
                        <li onClick={() => setMenuItemSelected(btn.title)} key={btn.title} className={styles.menu}>
                            <div style={menuItemSelected === btn.title ? selectedStyle : {}} className={styles.menuItem} onClick={() => toggleMenu(btn.title)}>
                                {btn.icon}
                                <h3>{btn.title}</h3>
                            </div>

                            {/* Se tiver filhos e o menu estiver aberto */}
                            {btn.childrens && openMenu === btn.title && (
                                <ul className={styles.submenu}>
                                    {btn.childrens.map((child, index) => (
                                        <li onClick={() => handleSelect(child)} style={submenuItemSelected === child ? selectedStyle : {}} key={index} className={styles.submenuItem}>
                                            {child}
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