import { useState } from "react"
import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight, OctagonX } from "lucide-react"
import Spinner from "@/components/ui/Spinner"
import useSWR from "swr"
import FeedbackMessage from "@/components/ui/FeedbackMessage"

interface IDentistView {
    procedure: string | null,
    dentistId: (id: number | null) => void
    dentistName: (dentistName: string | null) => void
    visible: boolean
    onBack: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SELECT_VIEW = "SELECT_VIEW"
const SHOW_SELECTED_VIEW = "SHOW_SELECTED_VIEW"

export default function DentistView({ procedure, dentistId, dentistName, visible, onBack, onNext }: IDentistView) {

    // Função assícrona usada pelo "useSWR" que busca e retorna os dentistas de acordo com o procedimento selecionado, ao montar o componente
    async function fetcher(url: string) {
        const res = await fetch(url, {
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        })

        let data

        try {
            data = await res.json()
            data = data.filter((dentist: IDentist) => dentist.specialty.includes(procedure!))
        } catch {
            throw new Error("Erro ao interpretar a resposta do servidor")
        }

        if (!res.ok) {
            const errorMessage = data?.error || data?.message || "Erro desconhecido"
            throw new Error(errorMessage)
        }

        return data
    }

    // Constante utilizada no "useSWR" para garantir a busca dos dentistas somente quando a tela estiver visivel
    const shouldFetch = visible

    const { data: dentists, error, isLoading } = useSWR(
        shouldFetch ? "/api/dentist" : null,
        fetcher,
        { revalidateOnFocus: false }
    )
    const [selectedDentist, setSelectedDentist] = useState<IDentist | null>(null)
    const [currentView, setCurrentView] = useState<string>(SELECT_VIEW)

    function handleNext() {
        dentistId(selectedDentist!.id)
        dentistName(selectedDentist!.name)
        setCurrentView(SHOW_SELECTED_VIEW)
    }

    function handleBack() {
        setCurrentView(SELECT_VIEW)
        dentistId(null)
        dentistName(null)
        setSelectedDentist(null)
    }

    return (
        <div className={`${styles.box} ${visible && styles.visible}`}>

            {/* Seleciona o Dentista */}
            {currentView === SELECT_VIEW && (
                <div className={styles.selectView}>
                    <Label text="Escolha o Dentista" />
                    {isLoading ? <Spinner /> : error ? <FeedbackMessage message={error} icon={<OctagonX />} /> :
                        (
                            <div className={styles.containerDentists}>
                                {dentists && dentists.map((dentist: IDentist) => (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Selecionar dentista ${dentist.name}`}
                                        className={`${styles.dentist} ${selectedDentist?.id === dentist.id ? styles.selected : ""}`}
                                        onClick={() => setSelectedDentist(dentist)}
                                        key={dentist.id}
                                    >
                                        <p>Dr. {dentist.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    <div className={styles.boxBtns}>
                        <Button onClick={e => onBack(e)} text="Voltar" iconStart={<ArrowLeft />} />
                        <Button
                            text="Próximo"
                            disabled={!selectedDentist}
                            onClick={handleNext}
                            iconEnd={<ArrowRight />}
                        />
                    </div>
                </div>
            )}

            {/* Mostra o Dentista selecionado */}
            {currentView === SHOW_SELECTED_VIEW && (
                <div className={styles.showSelectedView}>
                    <p>Dentista selecionado: <br /><span className={styles.span}>Dr. {selectedDentist!.name}</span></p>
                    <div className={styles.boxBtns}>
                        <Button text="Voltar" iconStart={<ArrowLeft />} onClick={handleBack} />
                        <Button text="Próximo" iconEnd={<ArrowRight />} onClick={e => onNext(e)} />
                    </div>
                </div>
            )}
        </div>
    )
}