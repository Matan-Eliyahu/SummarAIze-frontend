// import { FaCircleNotch } from "react-icons/fa6";
import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size: "xs" | "s" | "m" | "l";
  fullPage?: boolean;
  text?: string;
}

function Spinner({ size, fullPage, text }: SpinnerProps) {
  const fontSize = size == "xs" ? "0.5rem" : size == "s" ? "0.8rem" : size == "m" ? "1rem" : "1.5rem";

  return fullPage ? (
    <div className={styles.fullPageBox}>
      {text && text}
      <span className={styles.spinner} style={{ width: fontSize, height: fontSize }} />
    </div>
  ) : (
    <>
      <span className={styles.spinner} style={{ width: fontSize, height: fontSize }} />
    </>
  );
}

export default Spinner;
