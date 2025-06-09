import Divider from "@/components/ui/Divider"
import styles from "./styles.module.scss"

interface ISectionWrapper {
    title: string
    children: React.ReactElement
}

export default function SectionWrapper({ title, children }: ISectionWrapper) {
    return (
        <section className={styles.sectionWrapper}>
            <h1>{title}</h1>
            <Divider />
            <div className={styles.children}>{children}</div>
        </section>
    )
}