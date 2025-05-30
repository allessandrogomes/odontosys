import styles from "./styles.module.scss"
import { formatDateISO } from "@/utils/formatDateISO"
import { formatHour } from "@/utils/formatHour"
import { FaArrowLeft } from "react-icons/fa"

interface ISelectAppointmentView {
    onSelectAppointment: (appointment: IAppointment) => void
    onBack: (onBack: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    visible: boolean
    appointmentsFound: IAppointment[] | []
}

export default function SelectAppointmentView({ onSelectAppointment, onBack, visible, appointmentsFound }: ISelectAppointmentView) {

    return (
        <div className={`${visible && styles.visible} ${styles.selectAppointment}`}>
            <button onClick={onBack}><FaArrowLeft />Voltar</button>
            <h1>Selecione a Consulta</h1>
            {appointmentsFound.length > 0 ? (
                <>
                    <p className={styles.patientName}>Paciente: <span>{appointmentsFound[0].patient.name}</span></p>
                    {appointmentsFound.map(app => (
                        <div onClick={() => onSelectAppointment(app)} key={app.id}>
                            <p>{app.procedure}</p>
                            <span></span>
                            <p>Dr. {app.dentist.name}</p>
                            <span></span>
                            <p>{formatDateISO(app.scheduledAt)}</p>
                            <span></span>
                            <p>{formatHour(app.scheduledAt)} - {formatHour(app.endsAt)}</p>
                        </div>
                    ))}

                </>
            ) : (
                <p>Nenhuma consulta a mostrar...</p>
            )}
        </div>
    )
}