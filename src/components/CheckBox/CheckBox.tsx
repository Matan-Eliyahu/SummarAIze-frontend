import { ReactNode, useState, useEffect } from "react";
import { FaSquare, FaSquareCheck } from "react-icons/fa6";
import styles from "./CheckBox.module.scss";

interface CheckBoxProps {
  set: boolean;
  children: ReactNode;
  onChange: (isChecked: boolean) => void;
}

export default function CheckBox({ set, children, onChange }: CheckBoxProps) {
  const [isChecked, setIsChecked] = useState(set);

  useEffect(() => {
    setIsChecked(set);
  }, [set]);

  function handleCheckBoxChange() {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange(newCheckedState);
  }

  return (
    <div className={styles.checkBoxContainer}>
      <div className={styles.checkBox} onClick={handleCheckBoxChange}>
        {isChecked ? <FaSquareCheck className={styles.checkBoxIcon} /> : <FaSquare className={styles.checkBoxIcon} />}
      </div>
      {children}
    </div>
  );
}
