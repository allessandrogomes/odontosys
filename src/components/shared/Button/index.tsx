import styles from "./styles.module.scss"

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    icon?: React.ReactElement
}

export default function Button({ text, icon, disabled = false, type = "button" }: IButton) {
    return (
        <button className={`${styles.button} ${disabled && styles.disabled}`} disabled={disabled} type={type}>
            {icon && icon}
            {text}
        </button>
    )
}