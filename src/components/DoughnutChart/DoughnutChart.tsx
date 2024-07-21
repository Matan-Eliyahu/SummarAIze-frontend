import { FaChartPie } from "react-icons/fa6";
import styles from "./DoughnutChart.module.scss";

interface DoughnutChartProps {
  fileTypeCounts: {
    pdf: number;
    image: number;
    audio: number;
  };
}

export default function DoughnutChart({ fileTypeCounts }: DoughnutChartProps) {
  const total = fileTypeCounts.pdf + fileTypeCounts.image + fileTypeCounts.audio;
  console.log("totle:",total)
  const pdfPercentage = (fileTypeCounts.pdf / total) * 100 || 0;
  const imagePercentage = (fileTypeCounts.image / total) * 100 || 0;
  const audioPercentage = (fileTypeCounts.audio / total) * 100 || 0;

  console.log("pdf: ", pdfPercentage, "%");
  console.log("image: ", imagePercentage, "%");
  console.log("audio: ", audioPercentage, "%");

  const gradient = `conic-gradient(
    #e5252a 0% ${pdfPercentage}%,
    #0ac963 ${pdfPercentage}% ${pdfPercentage + imagePercentage}%, 
    #ffc10a ${pdfPercentage + imagePercentage}% ${pdfPercentage + imagePercentage + audioPercentage}%
  )`;

  return (
    <div className={styles.doughnutBox}>
      <div className={styles.title}>
        <FaChartPie className={styles.titleIcon} />
        Files
      </div>
      <div className={styles.doughnutCircle} style={{ background: total > 0 ? gradient : "" }}>
        <div className={styles.circleCenter}></div>
      </div>
      <div className={styles.precentageContainer}>
        <div className={styles.precentageBox}>
          PDF
          <div className={styles.dotBox}>
            <div className={styles.pdfDot} />
            {`${pdfPercentage.toFixed(1)}%`}
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
          Audio
          <div className={styles.dotBox}>
            <div className={styles.audioDot} />
            {`${audioPercentage.toFixed(1)}%`}
          </div>
        </div>
      </div>
    </div>
  );
}
