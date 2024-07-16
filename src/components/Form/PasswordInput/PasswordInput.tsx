import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PasswordInput.module.scss";
import { InputFormElement } from "../../../common/types";

interface PasswordInputProps {
  elem: InputFormElement;
  value: string;
  onChange: (value: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ elem, value, onChange }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className={styles.inputLabel} key={`${elem.name}Lbl`}>
      {elem.label}
      <div className={styles.passwordInputContainer}>
        <input key={elem.name} type={showPassword ? "text" : "password"} name={elem.name} value={value} onChange={handleInputChange} className={styles.input} />
        <div className={styles.passwordToggle} onClick={handleTogglePassword}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>
    </label>
  );
};

export default PasswordInput;
