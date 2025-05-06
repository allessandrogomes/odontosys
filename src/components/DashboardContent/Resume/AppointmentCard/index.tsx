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

interface IAppointmentCardProps extends IAppointmentCard, IOnClick {}

function getFirstAndSecondName(fullName: string): string {
    const parts = fullName.trim().split(" ")
    return parts.slice(0, 2).join(" ")
}

export default function AppointmentCard({ patientName, procedure, start, end, onClickFinish, onClickCancel }: IAppointmentCardProps) {
    return (
        <div className={styles.box}>
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