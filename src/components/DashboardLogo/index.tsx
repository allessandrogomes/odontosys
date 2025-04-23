import Image from "next/image"
import styles from "./styles.module.scss"

export default function DashboardLogo() {
    return (
        <div className={styles.logo}>
            <Image className={styles.image} src="/images/logo.webp" width={500} height={500} alt="Logo OdontoSys"/>
        </div>
    )
}