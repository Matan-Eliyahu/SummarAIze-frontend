import { ReactNode, useRef } from "react";
import styles from "./RadioButton.module.scss";

interface RadioButtonProps {
  name: string;
  value: string;
  content: ReactNode;
  checked: boolean;
  onChange: (value: string) => void;
}

export default function RadioButton({ name, value, content, checked, onChange }: RadioButtonProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  function handleSpanClick() {
    if (spanRef.current) {
      const input = spanRef.current.previousElementSibling as HTMLInputElement;
      input.click();
      onChange(value);
    }
  }

  return (
    <label className={styles.radioButtonBox} onClick={handleSpanClick}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className={styles.radioInput} />
      <span ref={spanRef} className={styles.customRadio}></span>
      {content}
    </label>
  );
}
