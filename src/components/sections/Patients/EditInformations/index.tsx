import { useState } from "react"
import EditForm from "./EditForm"
import SearchForm from "./SearchForm"
import toast, { Toaster } from "react-hot-toast"
import SectionWrapper from "@/components/layout/SectionWrapper"

export default function EditInformations() {
    const [patient, setPatient] = useState<IPatient | null>(null)

    function handleOnSuccess() {
        toast.success("Dados atualizados com sucesso!")
        setPatient(null)
    }
    return (
        <SectionWrapper title="Editar Informações do Paciente">
            <>
                <SearchForm patient={patient => setPatient(patient)} visible={!patient} />

                {/* Mostra o formulário de edição apenas se encontrar um paciente */}
                {patient && <EditForm patient={patient} onBack={() => setPatient(null)} onSuccess={() => handleOnSuccess()} />}

                <Toaster />
            </>
        </SectionWrapper>
    )
}