import Widget from "../Widget";
import ProgressBar from "../../ProgressBar/ProgressBar";
import { FaBox } from "react-icons/fa6";
import styles from "./StorageWidget.module.scss";

interface StorageWidgetProps {
  storage: number;
  totalStorage: number;
  loading: boolean;
}

export default function StorageWidget({ storage, totalStorage, loading }: StorageWidgetProps) {
  const progress = (storage / totalStorage) * 100;
  const isGB = totalStorage > 999;
  totalStorage = isGB ? totalStorage / 1000 : totalStorage;
  const precentage = progress.toFixed(0);

  return (
    <Widget title="Storage" icon={FaBox} badge={{ value: `${precentage}%`, label: "in use" }} loading={loading}>
      <div className={styles.progressBarBox}>
        <ProgressBar progress={progress} />
      </div>
      <div className={styles.label}>
        <span className={styles.storageSize}>{storage}</span> <span className={styles.sizeUnitLabel}>MB</span> / <span className={styles.totalStorage}>{totalStorage}</span>{" "}
        <span className={styles.sizeUnitLabel}>{isGB ? "GB" : "MB"}</span>
      </div>
    </Widget>
  );
}
