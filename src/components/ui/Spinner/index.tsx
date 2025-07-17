import { Loader } from "lucide-react"
import styles from "./styles.module.scss"

interface ISpinner {
    className?: string
}

export default function Spinner({ className }: ISpinner) {
    return (
        <Loader data-testid="spinner" className={`${styles.spinner} ${className ?? ""}`} />
    )
}