import Widget from "../Widget";
import { FaChartPie } from "react-icons/fa6";
import styles from "./FileWidget.module.scss";

interface FileWidgetProps {
  fileTypeCounts: {
    pdf: number;
    image: number;
    audio: number;
  };
  loading: boolean;
}

export default function FileWidget({ fileTypeCounts, loading }: FileWidgetProps) {
  const total = fileTypeCounts.pdf + fileTypeCounts.image + fileTypeCounts.audio;
  const pdfPercentage = (fileTypeCounts.pdf / total) * 100 || 0;
  const imagePercentage = (fileTypeCounts.image / total) * 100 || 0;
  const audioPercentage = (fileTypeCounts.audio / total) * 100 || 0;

  const gradient = `conic-gradient(
    #e5252a 0% ${pdfPercentage}%,
    #0ac963 ${pdfPercentage}% ${pdfPercentage + imagePercentage}%, 
    #ffc10a ${pdfPercentage + imagePercentage}% ${pdfPercentage + imagePercentage + audioPercentage}%
  )`;

  return (
    <Widget title="Files" icon={FaChartPie} badge={{ value: total.toString(), label: "files stored" }} loading={loading}>
      <div className={styles.doughnutCircle} style={{ background: total > 0 ? gradient : "" }}>
        <div className={styles.circleCenter}>{total} files</div>
      </div>
      <div className={styles.precentageContainer}>
        <div className={styles.precentageBox}>
          Audio
          <div className={styles.dotBox}>
            <div className={styles.audioDot} />
            {`${audioPercentage.toFixed(1)}%`}
          </div>
        </div>
        <div className={styles.precentageBox}>
          Image
          <div className={styles.dotBox}>
            <div className={styles.imageDot} />
            {`${imagePercentage.toFixed(1)}%`}
          </div>
        </div>
        <div className={styles.precentageBox}>
          Pdf
          <div className={styles.dotBox}>
            <div className={styles.pdfDot} />
            {`${pdfPercentage.toFixed(1)}%`}
          </div>
        </div>
      </div>
    </Widget>
  );
}
