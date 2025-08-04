import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight, OctagonX } from "lucide-react"
import Spinner from "@/components/ui/Spinner"
import useSWR from "swr"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import { useAppointmentContext } from "@/contexts/AppointmentContext"
import fetcher from "@/services/dentist/getDentistByProcedure"

export default function SelectDentist() {
    const { state, dispatch } = useAppointmentContext()
    const { data: dentists, error, isLoading } = useSWR<IDentist[]>(`/api/dentist?procedure=${encodeURIComponent(state.procedure!)}`, fetcher, { revalidateOnFocus: false })

    function handleSelectDentist(dentist: IDentist) {
        dispatch({
            type: "SET_DENTIST",
            payload: { id: dentist.id, name: dentist.name }
        })
    }

    function handleBack() {
        dispatch({ type: "SET_STEP", payload: state.step - 1 })
        dispatch({ type: "SET_DENTIST", payload: { id: null, name: null } }) // Reseta dentista selecionado
    }

    function handleNext() {
        dispatch({ type: "SET_STEP", payload: state.step + 1 })
    }

    return (
        <div className={styles.box}>
            <div className={styles.selectView}>
                <Label text="Escolha o Dentista" />
                {isLoading ? <Spinner />
                    : error ? <FeedbackMessage message={error} icon={<OctagonX />} />
                        : (
                            <div className={styles.containerDentists}>
                                {dentists && dentists.map((dentist: IDentist) => (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Selecionar dentista ${dentist.name}`}
                                        className={`${styles.dentist} ${state.dentistId === dentist.id ? styles.selected : ""}`}
                                        onClick={() => handleSelectDentist(dentist)}
                                        key={dentist.id}
                                    >
                                        <p>Dr. {dentist.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                <div className={styles.boxBtns}>
                    <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack}/>
                    <Button text="Próximo" iconEnd={<ArrowRight />} onClick={handleNext} disabled={!state.dentistName} />
                </div>
            </div>
        </div>
    )
}