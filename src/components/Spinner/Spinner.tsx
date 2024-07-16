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
      <FaCircleNotch className={styles.spinnerIcon} style={{ fontSize: size == "xs" ? "1rem" : size == "s" ? "1.3rem" : size == "m" ? "1.5rem" : "1.8rem" }} />
    </div>
  ) : (
    <FaCircleNotch className={styles.spinnerIcon} style={{ fontSize: size == "xs" ? "1rem" : size == "s" ? "1.3rem" : size == "m" ? "1.5rem" : "1.8rem" }} />
  );
}

export default Spinner;
