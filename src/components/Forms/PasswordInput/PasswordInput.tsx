import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./PasswordInput.module.scss";
import { FormElement } from "../Form";
import { ImCheckmark2 } from "react-icons/im";

interface PasswordInputProps {
  elem: FormElement;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isSignUp?: boolean;
}

export default function PasswordInput({ elem, value, onChange, disabled, isSignUp }: PasswordInputProps) {
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
        <input
          key={elem.key}
          type={showPassword ? "text" : "password"}
          name={elem.key}
          value={value}
          autoComplete="current-password"
          onChange={handleInputChange}
          className={styles.input}
          disabled={disabled}
          required
        />
        <div className={isSignUp ? styles.passwordToggle : styles.passwordToggleConfirm} onClick={handleTogglePassword}>
          {showPassword ? <FaEyeSlash className={styles.eyeIcon} /> : <FaEye className={styles.eyeIcon} />}
        </div>
        {isSignUp && (
          <div className={styles.passRulesBox}>
            <div className={styles.passRuleText}>
              <ImCheckmark2 />
              Must be at least 8 characters
            </div>
            <div className={styles.passRuleText}>
              <ImCheckmark2 />
              Does not contain your email address
            </div>
          </div>
        )}
      </div>
    </label>
  );
}
