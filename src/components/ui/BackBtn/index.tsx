import styles from "./styles.module.scss"
import { FaArrowLeft } from "react-icons/fa"

interface IBackBtn {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export default function BackBtn({ onClick }: IBackBtn) {
    return (
        <button onClick={onClick} className={styles.backBtn}><FaArrowLeft />Voltar</button>
    )
} 