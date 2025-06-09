import styles from "./styles.module.scss"

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    iconStart?: React.ReactElement
    iconEnd?: React.ReactElement
    className?: string
}

export default function Button({ text, iconStart, iconEnd, disabled = false, type = "button", className, ...rest }: IButton) {
    return (
        <button className={`${styles.button} ${disabled && styles.disabled} ${className ?? ""}`} disabled={disabled} type={type} {...rest}>
            {iconStart && iconStart}
            {text}
            {iconEnd && iconEnd}
        </button>
    )
}