import styles from "./styles.module.scss"

interface IFeedbackMessage {
    message: string
    icon?: React.ReactElement
}

export default function FeedbackMessage({ message, icon }: IFeedbackMessage) {
    return (
        <p className={styles.message}>
            {icon && icon}
            {message}
        </p>
    )
}