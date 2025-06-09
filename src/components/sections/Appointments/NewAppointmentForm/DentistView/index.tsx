import { useEffect, useState } from "react"
import styles from "./styles.module.scss"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/Button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Spinner from "@/components/ui/Spinner"

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
    const [dentists, setDentists] = useState<IDentist[]>([])
    const [selectedDentist, setSelectedDentist] = useState<IDentist | null>(null)
    const [currentView, setCurrentView] = useState<string>(SELECT_VIEW)
    const [isLoading, setIsLoading] = useState<boolean>(false)

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

    useEffect(() => {
        async function fetchDentists() {
            setIsLoading(true)
            try {
                const response = await fetch("/api/dentist")
                const data = await response.json()
                const filteredDentists = data.filter((dentist: IDentist) => dentist.specialty.includes(procedure!))
                setDentists(filteredDentists)
            } catch (error) {
                alert(JSON.stringify(error))
            } finally {
                setIsLoading(false)
            }
        }

        if (procedure) {
            fetchDentists()
        }
    }, [procedure])
    return (
        <div className={`${styles.box} ${visible && styles.visible}`}>

            {/* Seleciona o Dentista */}
            {currentView === SELECT_VIEW && (
                <div className={styles.selectView}>
                    <Label text="Escolha o Dentista" />
                    {isLoading ?
                        <Spinner /> :
                        (
                            <div className={styles.containerDentists}>
                                {dentists && dentists.map(dentist => (
                                    <div className={`${styles.dentist} ${selectedDentist?.id === dentist.id ? styles.selected : ""}`} onClick={() => setSelectedDentist(dentist)} key={dentist.id}>
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