import { FaArrowLeft } from "react-icons/fa"
import styles from "./styles.module.scss"

const PROCEDURE_AND_DENTIST = "PROCEDURE_AND_DENTIST"
const TIME_AND_DAY = "TIME_AND_DAY"

interface ISelectChangeView {
    onBack: (onBack: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onSelectChange: (onSelectChange: string) => void
    visible: boolean
}

export default function SelectChangeView({ onBack, onSelectChange, visible }: ISelectChangeView) {

    return (
        <div className={`${visible && styles.visible} ${styles.selectChange}`}>
            <button onClick={onBack} className={styles.backBtn}><FaArrowLeft />Voltar</button>
            <h2>Selecione o que deseja alterar</h2>
            <div className={styles.btns}>
                <button onClick={() => onSelectChange(PROCEDURE_AND_DENTIST)}>Procedimento e Dentista</button>
                <button onClick={() => onSelectChange(TIME_AND_DAY)}>Dia e Horário</button>
            </div>
        </div>
    )
}