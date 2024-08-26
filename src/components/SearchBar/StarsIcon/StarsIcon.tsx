import { useEffect, useState } from "react";
import styles from "./StarsIcon.module.scss";

interface StarsIconProps {
  size: number;
  onToggleIsOn: (isOn: boolean) => void;
}

export default function StarsIcon({ size, onToggleIsOn }: StarsIconProps) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    onToggleIsOn(on);
  }, [on]);

  function toggleIsOn() {
    setOn((prev) => !prev);
  }

  return <div className={on ? styles.starsIcon : styles.starsIconOff} style={{ width: size, height: size }} onClick={toggleIsOn} />;
}
