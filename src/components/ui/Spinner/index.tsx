import { Loader } from "lucide-react"
import styles from "./styles.module.scss"

export default function Spinner() {
    return (
        <Loader className={styles.spinner} />
    )
}