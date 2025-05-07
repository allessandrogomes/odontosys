import styles from "./styles.module.scss"

interface IDashboardHeader {
    receptionist: string
    onLogout: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    title: string
}

export default function DashboardHeader({ receptionist, title, onLogout }: IDashboardHeader) {
    const date = new Date()

    const formatDate = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit"
    }).format(date)

    const todayDate = formatDate.charAt(0).toUpperCase() + formatDate.slice(1).replace("feira", "Feira")


    return (
        <header className={styles.header}>
            <div className={styles.boxLogout}>
                <h2>Olá, Recepcionista <span>{receptionist}</span></h2>
                <button onClick={onLogout}>Sair</button>
            </div>
            <h1>{title} | {todayDate}</h1>
        </header>
    )
}