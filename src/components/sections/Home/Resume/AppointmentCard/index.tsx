import { formatHour } from "@/utils/formatHour"
import styles from "./styles.module.scss"
import { FaBell } from "react-icons/fa"
import { FaCheckCircle } from "react-icons/fa"
import { MdCancel } from "react-icons/md"

interface IAppointmentCard {
    patientName: string
    procedure: string
    start: string
    end: string
}

interface IOnClick {
    onClickFinish: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onClickCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

interface IAppointmentCardProps extends IAppointmentCard, IOnClick {
    isLast?: boolean
}

function getFirstAndSecondName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 0) return ""
    if (parts.length === 1) return parts[0]
    return `${parts[0]} ${parts[parts.length -1]}`
}

export default function AppointmentCard({ patientName, procedure, start, end, onClickFinish, onClickCancel, isLast }: IAppointmentCardProps) {
    return (
        <div className={`${styles.box} ${isLast ? styles.lastCard : ""}`} data-testid="appointment-card">
            <div className={styles.connection}></div>
            <div className={styles.card}>
                <h4>{getFirstAndSecondName(patientName)} <br></br> {procedure} <br></br> {formatHour(start)} - {formatHour(end)}</h4>
                <div className={styles.divisory}></div>
                <div className={styles.btns}>
                    <button title="Notificar Dentista que o paciente chegou"><FaBell style={{ position: "relative", top: "2px" }} /></button>
                    <button onClick={onClickFinish} title="Confirmar conclusão da consulta"><FaCheckCircle style={{ position: "relative", top: "2px" }} /></button>
                    <button onClick={onClickCancel} title="Cancelar consulta"><MdCancel style={{ position: "relative", top: "2px" }} /></button>
                </div>
            </div>
        </div>
    )
}