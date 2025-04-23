import styles from "./styles.module.scss"
import { IoMdHome } from "react-icons/io"
import { FaCalendarAlt } from "react-icons/fa"
import { FaRegUser } from "react-icons/fa"
import { TbReportAnalytics } from "react-icons/tb"

const sidebarBtns = [
    { icon: <IoMdHome className={styles.icon}/>, title: "Início" },
    { icon: <FaCalendarAlt className={styles.icon} />, title: "Agendamentos" },
    { icon: <FaRegUser className={styles.icon}/>, title: "Pacientes" },
    { icon: <TbReportAnalytics className={styles.icon}/>, title: "Relatórios" }
]

export default function DashboardSideBar() {
    return (
        <aside className={styles.aside}>
            <nav>
                <ul>
                    {sidebarBtns.map(btn => <li key={btn.title}>{btn.icon} <h3>{btn.title}</h3></li>)}
                </ul>
            </nav>
        </aside>
    )
}