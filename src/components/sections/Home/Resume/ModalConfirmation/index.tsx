import { formatHour } from "@/utils/formatHour"
import styles from "./styles.module.scss"
import { FaCheck } from "react-icons/fa"
import { FaXmark } from "react-icons/fa6"

const FINISH = "FINISH"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CANCEL = "CANCEL"

type ModalAction = typeof FINISH | typeof CANCEL

interface ITodayAppointment {
    id: number
    scheduledAt: string
    endsAt: string,
    procedure: string
    patient: { name: string }
}

interface IModalConfirmation {
    type: ModalAction
    appointment: ITodayAppointment
    onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onConfirm: (type: ModalAction) => void
}

export default function ModalConfirmation({ type, appointment, onCancel, onConfirm }: IModalConfirmation) {
    return (
        <div
            className={styles.modalOverlay}
            role="dialog"
            aria-modal
            aria-labelledby="modal-title"
        >
            <div className={styles.modalContent}>
                <h2 id="modal-title">Deseja {type === FINISH ? "Finalizar" : "Cancelar"} essa consulta?</h2>
                <p>Paciente: <span>{appointment.patient.name}</span></p>
                <p>Procedimento: <span>{appointment.procedure}</span></p>
                <p>Horário: <span>{formatHour(appointment.scheduledAt)} - {formatHour(appointment.endsAt)}</span></p>
                <div className={styles.btns}>
                    <button
                        className={`${type === FINISH ? styles.finishBtn : styles.cancelBtn}`}
                        onClick={() => onConfirm(type)}
                    >
                        {type === FINISH ? <FaCheck className={styles.finishIcon} /> : <FaXmark className={styles.cancelIcon} />}
                        {type === FINISH ? "Finalizar" : "Cancelar"}
                    </button>
                    <button className={styles.backBtn} onClick={onCancel}>Voltar</button>
                </div>
            </div>
        </div>
    )
}