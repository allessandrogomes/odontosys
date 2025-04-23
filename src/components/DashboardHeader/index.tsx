import styles from "./styles.module.scss"

interface IDashboardHeader {
    receptionist: string
    onLogout: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export default function DashboardHeader({ receptionist, onLogout }: IDashboardHeader) {
    return (
        <header className={styles.header}>
            <div className={styles.boxLogout}>
                <h2>Olá, Recepcionista <span>{receptionist}</span></h2>
                <button onClick={onLogout}>Sair</button>
            </div>
            <h1>Consultas de Hoje | Segunda-Feira, 20/04</h1>
        </header>
    )
}