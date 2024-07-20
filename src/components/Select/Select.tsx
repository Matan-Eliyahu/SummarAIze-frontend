import { useState, useEffect } from "react";
import styles from "./Select.module.scss";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  set: string | number;
  defaultValue?: string;
  onChange: (value: string | number) => void;
}

export default function Select({ options, set, defaultValue, onChange }: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<string | number>(defaultValue || set);

  // Ensure local state is in sync with prop
  useEffect(() => {
    setSelectedValue(set);
  }, [set]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className={styles.selectBox}>
      <select value={selectedValue} onChange={handleChange} className={styles.select}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
