import { FaBoxOpen } from "react-icons/fa6";
import ProgressBar from "../ProgressBar/ProgressBar";
import styles from "./TotalSizeProgressBar.module.scss";

interface TotalSizeProgressBarProps {
  totalSize: number;
  maxSize: number;
}

export default function TotalSizeProgressBar({ totalSize, maxSize }: TotalSizeProgressBarProps) {
  const progress = (totalSize / maxSize) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.title}>
        <FaBoxOpen className={styles.titleIcon} />
        Storage
      </div>
      <div className={styles.progressBarBox}>
        <ProgressBar progress={progress} />
      </div>
      <div className={styles.textBox}>
        <div className={styles.totalSizeText}>{totalSize}</div>
        <div className={styles.maxSizeText}>/</div>
        <div className={styles.maxSizeText}>{`${maxSize} MB`}</div>
      </div>
    </div>
  );
}
