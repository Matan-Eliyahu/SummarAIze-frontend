import styles from "./Button.module.scss";
import { FaRegUser } from "react-icons/fa";

interface ButtonProps {
  text: string;
  theme: "primary" | "secondary";
  size: "s" | "m" | "l";
  onClick: () => void;
}

function Button({ text, theme, onClick, size }: ButtonProps) {
  return (
    <button
      className={theme == "primary" ? styles.primary : styles.secondary}
      onClick={onClick}
    >
      {text}
      <FaRegUser className={styles.icon} />
    </button>
  );
}

export default Button;
