import { FaBox } from "react-icons/fa6";
import ProgressBar from "../ProgressBar/ProgressBar";
import styles from "./TotalSizeProgressBar.module.scss";
import Spinner from "../Spinner/Spinner";

interface TotalSizeProgressBarProps {
  totalSize: number;
  maxSize: number;
  loading: boolean;
}

export default function TotalSizeProgressBar({ totalSize, maxSize, loading }: TotalSizeProgressBarProps) {
  const progress = (totalSize / maxSize) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.title}>
        <FaBox className={styles.titleIcon} />
        Storage
      </div>
      <div className={styles.contentBox}>
        {loading ? (
          <Spinner size="s" />
        ) : (
          <>
            <div className={styles.progressBarBox}>
              <ProgressBar progress={progress} />
            </div>
            <div className={styles.textBox}>
              <div className={styles.totalSizeText}>
                {totalSize}
                <div className={styles.mbTextBox}>MB</div>
              </div>
              <div className={styles.seperatorText}>/</div>
              <div className={styles.maxSizeText}>
                {maxSize}
                <div className={styles.mbTextBox}>MB</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
