import { useState, useEffect, useRef } from "react";
import styles from "./CustomSelect.module.scss";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  defaultValue?: string;
  onChange: (value: string) => void;
}

export default function CustomSelect({ options, defaultValue, onChange }: CustomSelectProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className={styles.selectBox} ref={selectRef}>
      <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
        {options.find((option) => option.value === selectedValue)?.label || "Select an option"}
      </div>
      {isOpen && (
        <div className={styles.options}>
          {options.map((option) => (
            <div key={option.value} className={styles.option} onClick={() => handleOptionClick(option.value)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
