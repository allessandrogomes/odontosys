import Card from "@/components/ui/Card"
import { formatCPF } from "@/utils/formatCPF"
import { formatDateISO } from "@/utils/formatDateISO"
import { formatPhone } from "@/utils/formatPhone"
import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"

interface IPatientCard {
    patient: IPatient
    width?: string
    height?: string
}

export default function PatientCard({ patient, width = "max-content", height = "max-content" }: IPatientCard) {
    return (
        <Card className={styles.patientCard} width={width} height={height}>
            <>
                <Label text="Informações do Paciente"/>
                <p>Nome: <span>{patient.name}</span></p>
                <p>CPF: <span>{formatCPF(patient.cpf)}</span></p>
                <p>Email: <span>{patient.email}</span></p>
                <p>Telefone: <span>{formatPhone(patient.phone)}</span></p>
                <p>Data de Nascimento: <span>{formatDateISO(patient.birthDate)}</span></p>
            </>
        </Card>
    )
}