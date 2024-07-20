import { useState, useEffect } from "react";
import styles from "./Switch.module.scss";

interface SwitchProps {
  set: boolean;
  onChange: (isOn: boolean) => void;
}

export default function Switch({ set, onChange }: SwitchProps) {
  const [isOn, setIsOn] = useState(set);

  useEffect(() => {
    setIsOn(set);
  }, [set]);

  function handleSwitchChange() {
    const newIsOn = !isOn;
    setIsOn(newIsOn);
    onChange(newIsOn);
  }

  return (
    <div className={styles.switchBox}>
      <label className={styles.switch}>
        <input type="checkbox" checked={isOn} onChange={handleSwitchChange} />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
}
