import styles from "./Button.module.scss";

interface ButtonProps {
  theme: "primary" | "secondary";
  children: React.ReactNode; // Allow using text in the tag
  onClick: () => void;
}

function Button({ theme, children, onClick }: ButtonProps) {
  return (
    <button className={theme == "primary" ? styles.primary : styles.secondary} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
