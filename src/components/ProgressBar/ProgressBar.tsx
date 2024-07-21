import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
    </div>
  );
}
