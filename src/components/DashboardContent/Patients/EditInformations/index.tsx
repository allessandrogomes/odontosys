import { useState } from "react"
import EditForm from "./EditForm"
import styles from "./styles.module.scss"
import SearchForm from "./SearchForm"
import toast, { Toaster } from "react-hot-toast"

export default function EditInformations() {
    const [patient, setPatient] = useState<IPatient | null>(null)

    function handleOnSuccess() {
        toast.success("Dados atualizados com sucesso!")
        setPatient(null)
    }
    return (
        <div className={styles.editInformations}>
            <h2>Editar Informações do Paciente</h2>
            <SearchForm patient={patient => setPatient(patient)} visible={!patient}/>
            
            {/* Mostra o formulário de edição apenas se encontrar um paciente */}
            {patient && <EditForm patient={patient} onBack={() => setPatient(null)} onSuccess={() => handleOnSuccess()}/>}
            
            <Toaster />
        </div>
    )
}