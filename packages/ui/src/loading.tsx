import styles from "./loading.module.scss"

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-auto flex-grow flex-col items-center justify-center">
      <div className={styles.spinner}>
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
        <div className={styles.spinner_blade} />
      </div>
    </div>
  )
}
