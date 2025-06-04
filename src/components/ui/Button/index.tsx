import styles from "./styles.module.scss"

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    iconStart?: React.ReactElement
    iconEnd?: React.ReactElement
}

export default function Button({ text, iconStart, iconEnd, disabled = false, type = "button", ...rest }: IButton) {
    return (
        <button className={`${styles.button} ${disabled && styles.disabled}`} disabled={disabled} type={type} {...rest}>
            {iconStart && iconStart}
            {text}
            {iconEnd && iconEnd}
        </button>
    )
}