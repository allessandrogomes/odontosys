import BackBtn from "@/components/ui/BackBtn"
import styles from "./styles.module.scss"
import AppointmentList from "@/components/lists/AppointmentList"

interface ISelectAppointmentView {
    onSelectAppointment: (appointment: IAppointment) => void
    onBack: (onBack: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    visible: boolean
    appointmentsFound: IAppointment[] | []
}

export default function SelectAppointmentView({ onSelectAppointment, onBack, visible, appointmentsFound }: ISelectAppointmentView) {

    return (
        <div className={`${visible && styles.visible} ${styles.selectAppointment}`}>
            <BackBtn onClick={onBack} />
            <h2>Selecione a Consulta</h2>
            {appointmentsFound.length > 0 ? (
                <AppointmentList appointments={appointmentsFound} selectedAppointment={appointment => onSelectAppointment(appointment)} />
            ) : (
                <p>Nenhuma consulta a mostrar...</p>
            )}
        </div>
    )
}