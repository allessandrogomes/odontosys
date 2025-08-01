import styles from "./styles.module.scss"

interface ILabel extends React.LabelHTMLAttributes<HTMLLabelElement> {
    text: string
    htmlFor?: string
}

export default function Label({ text, htmlFor }: ILabel) {
    return (
        <label htmlFor={htmlFor} className={styles.label}>{text}</label>
    )
}