import { useEffect, useState } from "react"
import styles from "./styles.module.scss"

interface IDentistView {
    procedure: string | null,
    dentistId: (id: number | null) => void
    active: boolean
    onBack: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SELECT_VIEW = "SELECT_VIEW"
const SHOW_SELECTED_VIEW = "SHOW_SELECTED_VIEW"

export default function DentistView({ procedure, dentistId, active, onBack, onNext }: IDentistView) {
    const [dentists, setDentists] = useState<IDentist[]>([])
    const [selectedDentist, setSelectedDentist] = useState<IDentist | null>(null)
    const [currentView, setCurrentView] = useState<string>(SELECT_VIEW)

    function handleNext() {
        dentistId(selectedDentist!.id)
        setCurrentView(SHOW_SELECTED_VIEW)
    }

    function handleBack() {
        setCurrentView(SELECT_VIEW)
    }

    useEffect(() => {
        async function fetchDentists() {
            try {
                const response = await fetch("/api/dentist")
                const data = await response.json()
                const filteredDentists = data.filter((dentist: IDentist) => dentist.specialty.includes(procedure!))
                setDentists(filteredDentists)
            } catch (error) {
                alert(JSON.stringify(error))
            }
        }

        if (procedure) {
            fetchDentists()
        }
    }, [procedure])
    return (
        <div className={`${styles.container} ${active && styles.active}`}>

            {/* Seleciona o Dentista */}
            {currentView === SELECT_VIEW && (
                <div className={styles.selectView}>
                    <label>Escolha o Dentista</label>
                    <div className={styles.containerDentists}>
                        {dentists && dentists.map(dentist => (
                            <div className={`${styles.dentist} ${selectedDentist?.id === dentist.id ? styles.selected : ""}`} onClick={() => setSelectedDentist(dentist)} key={dentist.id}>
                                <p>Dr. {dentist.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.boxBtns}>
                        <button onClick={e => onBack(e)} className={styles.backBtn}>Voltar</button>
                        <button
                            disabled={!selectedDentist}
                            className={`${styles.nextBtn} ${selectedDentist && styles.active}`}
                            onClick={handleNext}
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            )}

            {/* Mostra o Dentista selecionado */}
            {currentView === SHOW_SELECTED_VIEW && (
                <div className={styles.showSelectedView}>
                    <p>Dentista selecionado: <br/><span className={styles.span}>Dr. {selectedDentist!.name}</span></p>
                    <div className={styles.boxBtns}>
                        <button onClick={handleBack} className={styles.backBtn}>Voltar</button>
                        <button onClick={e => onNext(e)} className={styles.nextBtn}>Próximo</button>
                    </div>
                </div>
            )}
        </div>
    )
}