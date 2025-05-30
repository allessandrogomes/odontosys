import styles from "./styles.module.scss"

export default function MainLayout({ children }: { children: React.ReactElement | undefined}) {
    return (
        <div className={styles.dashboard}>
            {children}
        </div>
    )
}