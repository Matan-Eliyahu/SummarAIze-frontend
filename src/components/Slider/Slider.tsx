import { useState } from "react";
import styles from "./Slider.module.scss";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue: number | string;
  options?: string[];
  onChange: (value: number | string) => void;
}

export default function Slider({ min, max, step, initialValue, onChange,options }: SliderProps) {
  const [value, setValue] = useState<number | string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = options ? options[Number(event.target.value)] : event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={styles.sliderBox}>
      <input
        type="range"
        min={options ? 0 : min}
        max={options ? options.length - 1 : max}
        step={options ? 1 : step}
        value={options ? options.indexOf(value as string) : value}
        onChange={handleChange}
        className={styles.slider}
      />
      <div className={styles.sliderValue}>{value}</div>
    </div>
  );
}
