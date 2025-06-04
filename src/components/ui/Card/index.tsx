import styles from "./styles.module.scss"

interface ICard {
    children: React.ReactElement
    width: string
    height: string
    className?: string
    key?: React.Key | null | undefined
}

export default function Card({ children, width, height, className, key }: ICard) {
    return (
        <div key={key} style={{ width, height }} className={`${styles.card} ${className ?? ""}`}>
            {children}
        </div>
    )
}