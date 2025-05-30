import styles from "./styles.module.scss"

interface ILabel extends React.LabelHTMLAttributes<HTMLLabelElement> {
    text: string
}

export default function Label({ text }: ILabel) {
    return (
        <label className={styles.label}>{text}</label>
    )
}