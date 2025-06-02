import styles from "./styles.module.scss"

interface IFeedbackMessage {
    message: string
    icon?: React.ReactElement
    className?: string
}

export default function FeedbackMessage({ message, icon, className }: IFeedbackMessage) {
    return (
        <p className={`${styles.message} ${className ?? ""}`}>
            {icon && icon}
            {message}
        </p>
    )
}