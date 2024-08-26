import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  progress: number;
  theme?: "primary" | "secondary" | "danger" | "create";
}

export default function ProgressBar({ progress, theme }: ProgressBarProps) {
  return (
    <div className={styles.progressContainer}>
      <div className={`${styles.progressBar} ${theme ? styles[theme] : ""}`} style={{ width: `${progress}%` }} />
    </div>
  );
}
