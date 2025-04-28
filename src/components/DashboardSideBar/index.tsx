import styles from "./styles.module.scss"
import { IoMdHome } from "react-icons/io"
import { FaCalendarAlt } from "react-icons/fa"
import { FaRegUser } from "react-icons/fa"
import { TbReportAnalytics } from "react-icons/tb"
import { useState } from "react"

const sidebarBtns = [
    { icon: <IoMdHome className={styles.icon} />, title: "Início" },
    { icon: <FaCalendarAlt className={styles.icon} />, title: "Agendamentos", childrens: ["Nova Consulta", "Reagendar Consulta", "Cancelar Consulta", "Alterar Consulta"] },
    { icon: <FaRegUser className={styles.icon} />, title: "Pacientes", childrens: ["Pesquisar", "Cadastrar", "Editar informações"] },
    { icon: <TbReportAnalytics className={styles.icon} />, title: "Relatórios" }
]

export default function DashboardSideBar() {
    const [openMenu, setOpenMenu] = useState<string | null>(null)

    function toggleMenu(title: string) {
        setOpenMenu(prev => (prev === title ? null : title))
      }

    return (
        <aside className={styles.aside}>
            <nav>
                <ul>
                    {sidebarBtns.map(btn => (
                        <li key={btn.title} className={styles.menu}>
                            <div className={styles.menuItem} onClick={() => btn.childrens && toggleMenu(btn.title)}>
                                {btn.icon}
                                <h3>{btn.title}</h3>
                            </div>

                            {/* Se tiver filhos e o menu estiver aberto */}
                            {btn.childrens && openMenu === btn.title && (
                                <ul className={styles.submenu}>
                                    {btn.childrens.map((child, index) => (
                                        <li key={index} className={styles.submenuItem}>
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