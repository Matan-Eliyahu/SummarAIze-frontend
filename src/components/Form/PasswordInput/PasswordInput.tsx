import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PasswordInput.module.scss";
import { FormElement } from "../Form";

interface PasswordInputProps {
  elem: FormElement;
  value: string;
  onChange: (value: string) => void;
  disabled?:boolean
}

const PasswordInput: React.FC<PasswordInputProps> = ({ elem, value, onChange,disabled }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className={styles.inputLabel}>
      {elem.label}
      <div className={styles.passwordInputContainer}>
        <input key={elem.key} type={showPassword ? "text" : "password"} name={elem.key} value={value} autoComplete="current-password" onChange={handleInputChange} className={styles.input} disabled={disabled} />
        <div className={styles.passwordToggle} onClick={handleTogglePassword}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>
    </label>
  );
};

export default PasswordInput;
