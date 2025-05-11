import { FaArrowLeft } from "react-icons/fa"
import styles from "./styles.module.scss"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

const SELECT_CHANGE = "SELECT_CHANGE"
const PROCEDURE_AND_DENTIST = "PROCEDURE_AND_DENTIST"
const TIME_AND_DAY = "TIME_AND_DAY"

interface IChangeAppointmentView {
    appointment: IAppointment
    onBack: (onBack: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

interface IDataToPatch {
    dentistId: number
    dentist: string
    procedure: string
    durationMinutes: number
}

export default function ChangeAppointmentView({ appointment, onBack }: IChangeAppointmentView) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentAppointment, setCurrentAppointment] = useState<IAppointment>(appointment)
    const [viewToShow, setViewToShow] = useState<string>(SELECT_CHANGE)
    const [procedures, setProcedures] = useState<IProcedure[]>([])
    const [dentists, setDentists] = useState<IDentist[]>([])
    const [dataToPatch, setDataToPatch] = useState<IDataToPatch>({
        dentistId: currentAppointment.dentistId,
        dentist: currentAppointment.dentist.name,
        procedure: currentAppointment.procedure,
        durationMinutes: currentAppointment.durationMinutes
    })
    const thereWasNotAChange: boolean = dataToPatch.dentistId === currentAppointment.dentistId && dataToPatch.procedure === currentAppointment.procedure

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
        setIsLoading(true)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dentist, ...form } = dataToPatch

        try {
            const response = await fetch(`/api/appointment/id/${currentAppointment.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Erro ao atualizar os dados")

            setIsLoading(false)
            setCurrentAppointment(data)
            setViewToShow(SELECT_CHANGE)
            toast.success("Informações alteradas com sucesso!")
        } catch (error) {
            setIsLoading(false)
            alert(JSON.stringify(error))
        }
    }

    useEffect(() => {
        async function fetchProcedures() {
            try {
                const response = await fetch("/api/procedure")
                const data = await response.json()
                setProcedures(data)
            } catch (error) {
                alert(JSON.stringify(error))
            }
        }

        fetchProcedures()
    }, [])

    useEffect(() => {
        async function fetchDentists() {
            try {
                const response = await fetch("/api/dentist")
                const data = await response.json()
                const filteredDentists = data.filter((dentist: IDentist) => dentist.specialty.includes(dataToPatch.procedure))
                setDentists(filteredDentists)
            } catch (error) {
                alert(JSON.stringify(error))
            }
        }

        if (dataToPatch.procedure) {
            fetchDentists()
        }
    }, [dataToPatch.procedure])

    return (
        <>
            {viewToShow === SELECT_CHANGE && (
                <div className={styles.changeAppointment}>
                    <button onClick={onBack} className={styles.backBtn}><FaArrowLeft />Voltar</button>
                    <h1>Selecione o que deseja alterar</h1>
                    <div className={styles.btns}>
                        <button onClick={() => setViewToShow(PROCEDURE_AND_DENTIST)}>Procedimento e Dentista</button>
                        <button onClick={() => setViewToShow(TIME_AND_DAY)}>Dia e Horário</button>
                    </div>
                </div>
            )}

            {viewToShow === PROCEDURE_AND_DENTIST && (
                <form onSubmit={handleSubmitPatch} className={styles.changeAppointment}>
                    <button onClick={() => setViewToShow(SELECT_CHANGE)} className={styles.backBtn}><FaArrowLeft />Voltar</button>
                    <h1>Alterar Procedimento e Dentista</h1>
                    <div className={styles.selectProcedure}>
                        <label>Procedimento</label>
                        <select onChange={handleChangeProcedure} value={dataToPatch.procedure}>
                            <option disabled value="">Selecione</option>
                            {procedures.map(procedure => <option value={procedure.procedure} key={procedure.id}>{procedure.procedure}</option>)}
                        </select>
                    </div>

                    <div className={styles.selectDentist}>
                        <label>Dentista</label>
                        <select onChange={handleChangeDentist} value={dataToPatch.dentist}>
                            <option disabled value="">Selecione</option>
                            {dentists.map(dentist => <option value={dentist.name} key={dentist.id}>Dr. {dentist.name}</option>)}
                        </select>
                    </div>

                    {!isLoading ? (
                        <button disabled={thereWasNotAChange} className={`${thereWasNotAChange && styles.disable} ${styles.btnSubmit}`} type="submit">Concluir</button>
                    ) : (
                        <Loader className={styles.spinner} />
                    )}
                </form>
            )}

            <Toaster />
        </>
    )
}