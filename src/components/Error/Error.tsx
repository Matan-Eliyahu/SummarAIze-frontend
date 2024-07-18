import { CgDanger } from "react-icons/cg";
import styles from "./Error.module.scss";

export interface ErrorProps {
  text: string;
  buttonText: string;
  onButtonClick: () => void;
  secondButtonText?: string;
  onSecondButtonClick?: () => void;
  buttonColor?: "danger" | "create" | "primary" | "secondary";
  secondButtonColor?: "danger" | "create" | "primary" | "secondary";
}

function Error({ text, buttonText, onButtonClick, secondButtonText, onSecondButtonClick, buttonColor, secondButtonColor }: ErrorProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorBox}>
        <div className={styles.contentBox}>
        <CgDanger size={20}/>
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
