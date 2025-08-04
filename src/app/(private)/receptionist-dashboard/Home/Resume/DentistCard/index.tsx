import styles from "./styles.module.scss"

export default function DentistCard({ dentistName }: { dentistName: string }) {
    return (
        <div className={styles.card}>
            <div className={styles.icon}></div>
            <div className={styles.divisory}></div>
            <h4>Dr. {dentistName}</h4>
        </div>
    )
}