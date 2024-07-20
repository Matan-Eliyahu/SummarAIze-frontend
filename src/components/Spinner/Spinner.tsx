import { FaCircleNotch } from "react-icons/fa6";
import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size: "xs" | "s" | "m" | "l";
  fullPage?: boolean;
  text?: string;
}

function Spinner({ size, fullPage, text }: SpinnerProps) {
  return fullPage ? (
    <div className={styles.fullPageBox}>
      {text && text}
      <FaCircleNotch className={styles.spinnerIcon} style={{ fontSize: size == "xs" ? "0.4rem" : size == "s" ? "0.7rem" : size == "m" ? "0.9rem" : "1.1rem" }} />
    </div>
  ) : (
    <FaCircleNotch className={styles.spinnerIcon} style={{ fontSize: size == "xs" ? "0.4rem" : size == "s" ? "0.7rem" : size == "m" ? "0.9rem" : "1.1rem" }} />
  );
}

export default Spinner;
