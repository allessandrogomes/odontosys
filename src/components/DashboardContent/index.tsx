import styles from "./styles.module.scss"

export default function DashboardContent({ children }: { children: React.ReactElement | undefined}) {
    return (
        <div className={styles.dashboard}>
            {children}
        </div>
    )
}