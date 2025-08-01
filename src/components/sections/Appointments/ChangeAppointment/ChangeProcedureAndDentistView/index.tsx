
import { FaArrowLeft } from "react-icons/fa"
import styles from "./styles.module.scss"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Spinner from "@/components/ui/Spinner"
import useSWR from "swr"
import fetcher from "@/services/fetcher"

interface IChangeAppointmentView {
    appointment: IAppointment
    onBack: (onBack: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onUpdate: (appointmentUpdated: IAppointment) => void
}

interface IDataToPatch {
    dentistId: number
    dentist: string
    procedure: string
    durationMinutes: number
}

export default function ChangeProcedureAndDentistView({ appointment, onUpdate, onBack }: IChangeAppointmentView) {
    const { data: procedures = [], isLoading } = useSWR<IProcedure[]>("/api/procedure", fetcher, {
        revalidateOnFocus: false
    })
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
    const [dentists, setDentists] = useState<IDentist[]>([])
    const [dataToPatch, setDataToPatch] = useState<IDataToPatch>({
        dentistId: appointment.dentistId,
        dentist: appointment.dentist.name,
        procedure: appointment.procedure,
        durationMinutes: appointment.durationMinutes
    })

    const thereWasNotAChange: boolean = dataToPatch.dentistId === appointment.dentistId && dataToPatch.procedure === appointment.procedure

    function handleChangeProcedure(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectProcedure = e.target.value
        const procedure = procedures.find(p => p.procedure === selectProcedure) || null

        if (procedure) {
            setDataToPatch(prev => ({ ...prev, procedure: procedure.procedure, durationMinutes: procedure.durationMinutes }))
        }
    }

    function handleChangeDentist(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectDentist = e.target.value
        const dentist = dentists.find(d => d.name === selectDentist) || null

        if (dentist) {
            setDataToPatch(prev => ({ ...prev, dentistId: dentist.id, dentist: dentist.name }))
        }
    }

    async function handleSubmitPatch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmiting(true)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dentist, ...form } = dataToPatch

        try {
            const response = await fetch(`/api/appointment/id/${appointment.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao atualizar os dados")

            setIsSubmiting(false)
            onUpdate(data)
            toast.success("Informações alteradas com sucesso!")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setIsSubmiting(false)
            toast.error(error.message || "Erro ao buscar os procedimentos")
        }
    }

    useEffect(() => {
        async function fetchDentists() {
            try {
                const response = await fetch("/api/dentist")
                const data = await response.json()
                const filteredDentists = data.filter((dentist: IDentist) => dentist.specialty.includes(dataToPatch.procedure!))
                setDentists(filteredDentists)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error(error.message || "Erro ao buscar os dentistas")
            }
        }

        if (dataToPatch.procedure) {
            fetchDentists()
        }
     
    }, [dataToPatch.procedure])

    return (
        <form onSubmit={handleSubmitPatch} className={styles.changeAppointment}>
            <button type="button" onClick={onBack} className={styles.backBtn}><FaArrowLeft />Voltar</button>
            <h2>Alterar Procedimento e Dentista</h2>
            {isLoading ? (
                <div className={styles.spinnerLoading}><Spinner /></div>
            ) : (
                <>
                    <div className={styles.selectField}>
                        <label>Procedimento</label>
                        <select onChange={handleChangeProcedure} value={dataToPatch.procedure}>
                            <option disabled value="">Selecione</option>
                            {procedures.map(procedure => <option value={procedure.procedure} key={procedure.id}>{procedure.procedure}</option>)}
                        </select>
                    </div>

                    <div className={styles.selectField}>
                        <label>Dentista</label>
                        <select onChange={handleChangeDentist} value={dataToPatch.dentist}>
                            <option disabled value="">Selecione</option>
                            {dentists.map(dentist => <option value={dentist.name} key={dentist.id}>Dr. {dentist.name}</option>)}
                        </select>
                    </div>

                    {!isSubmiting ? (
                        <button disabled={thereWasNotAChange} className={`${thereWasNotAChange && styles.disable} ${styles.btnSubmit}`} type="submit">Concluir</button>
                    ) : (
                        <div className={styles.spinnerSubmiting}><Spinner /></div>
                    )}

                </>
            )}

            <Toaster />
        </form>
    )
}