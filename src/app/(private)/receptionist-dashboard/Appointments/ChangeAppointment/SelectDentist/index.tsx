import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight, OctagonX } from "lucide-react"
import Spinner from "@/components/ui/Spinner"
import useSWR from "swr"
import FeedbackMessage from "@/components/ui/FeedbackMessage"
import fetcher from "@/services/dentist/getDentistByProcedure"
import { useChangeAppointmentContext } from "@/contexts/ChangeAppointmentContext"

export default function SelectDentist() {
    const { state, dispatch } = useChangeAppointmentContext()
    const procedure = state.selectedAppointment?.procedure
    const swrKey = procedure ? `/api/dentist?procedure=${encodeURIComponent(procedure)}` : null
    const { data: dentists, error, isLoading } = useSWR<IDentist[] | null>(swrKey, fetcher, { revalidateOnFocus: false })

    function handleSelect(dentist: IDentist) {
        dispatch({ type: "SET_SELECTED_APPOINTMENT", payload: state.selectedAppointment
            ? {
                ...state.selectedAppointment,
                dentist: dentist,
                dentistId: dentist.id,
                scheduledAt: null,
                endsAt: null
            }
            : null
         })
    }

    function handleBack() {
        dispatch({ type: "SET_STEP", payload: 3 })
    }

    function handleNext() {
        dispatch({ type: "SET_STEP", payload: 5 })
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
                                        className={`${styles.dentist} ${state.selectedAppointment && state.selectedAppointment.dentistId === dentist.id ? styles.selected : ""}`}
                                        onClick={() => handleSelect(dentist)}
                                        key={dentist.id}
                                    >
                                        <p>Dr. {dentist.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                <div className={styles.boxBtns}>
                    <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack}/>
                    <Button text="Próximo" iconEnd={<ArrowRight />} onClick={handleNext} disabled={!state.selectedAppointment?.dentist?.name} />
                </div>
            </div>
        </div>
    )
}