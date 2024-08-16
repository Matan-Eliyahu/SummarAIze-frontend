// import { CgDanger } from "react-icons/cg";
import styles from "./Error.module.scss";
import { FaCircleExclamation, FaCloudArrowUp } from "react-icons/fa6";

export interface ErrorProps {
  text: string;
  buttonText: string;
  onButtonClick: () => void;
  secondButtonText?: string;
  onSecondButtonClick?: () => void;
  buttonColor?: "danger" | "create" | "primary" | "secondary" | "cancel";
  secondButtonColor?: "danger" | "create" | "primary" | "secondary" | "cancel";
  icon?: "error" | "upload";
}

function Error({ text, buttonText, onButtonClick, secondButtonText, onSecondButtonClick, buttonColor, secondButtonColor, icon }: ErrorProps) {
  function iconSwitch(icon?: "error" | "upload") {
    switch (icon) {
      case "error":
        return <FaCircleExclamation className={styles.errorIcon} />;
      case "upload":
        return <FaCloudArrowUp className={styles.errorIcon} />;
      default:
        return <FaCircleExclamation className={styles.errorIcon} />;
    }
  }
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorBox}>
        <div className={styles.contentBox}>
          {iconSwitch(icon)}
          <div className={styles.errorTextBox}>{text}</div>
        </div>
        <div className={styles.buttonBox}>
          <button className={`${styles.button} ${buttonColor ? styles[buttonColor] : ""}`} onClick={onButtonClick}>
            {buttonText}
          </button>
          {secondButtonText && onSecondButtonClick && (
            <button className={`${styles.button} ${secondButtonColor ? styles[secondButtonColor] : ""}`} onClick={onSecondButtonClick}>
              {secondButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Error;
