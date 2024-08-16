import React, { useEffect, useState } from "react";
import styles from "./Form.module.scss";
import PasswordInput from "./PasswordInput/PasswordInput";
import Spinner from "../Spinner/Spinner";
import CheckBox from "../CheckBox/CheckBox";
import { useAlert } from "../../hooks/useAlert";
import { getErrorMessage, validators } from "../../utils/validators";

export type FieldType = "text" | "email" | "password";

export interface FormProps {
  elements: FormElement[];
  buttonText: string;
  theme?: "primary" | "secondary" | "success";
  onSubmit: (formData: { [key: string]: string }) => void;
  loading?: boolean;
  isSignUp?: boolean;
  buttonWidth?: string | number;
}

export type FormElement = {
  label: string;
  key: string;
  type: FieldType;
};

function Form({ elements, buttonText, theme, onSubmit, loading, isSignUp, buttonWidth }: FormProps) {
  const { setAlert } = useAlert();
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [isTermCheck, setIsTermCheck] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  }

  useEffect(() => {
    if (!formError) return;
    setAlert({
      text: formError,
    });
    setFormError(null);
  }, [formError]);

  function validateForm(): boolean {
    let error: string;

    for (const element of elements) {
      const value = formData[element.key] || "";
      const isValidField = validators[element.type](value);
      if (!isValidField) {
        error = getErrorMessage(element.type);
        setFormError(error);
        return false;
      }
    }

    return true;
  }

  function getButtonClassName(buttonTheme?: "primary" | "secondary" | "success") {
    if (!buttonTheme) return styles.primaryFormButton;
    switch (buttonTheme) {
      case "primary":
        return styles.primaryFormButton;
      case "secondary":
        return styles.secondaryFormButton;
      case "success":
        return styles.successFormButton;
    }
  }

  const formSwitch = (elem: FormElement, index: number): JSX.Element => {
    switch (elem.type) {
      case "email":
        return (
          <label className={styles.inputLabel} key={index}>
            {elem.label}
            <input key={elem.key} type={elem.type} name={elem.key} value={formData[elem.key] || ""} onChange={handleInputChange} disabled={loading} required autoComplete="off" />
          </label>
        );
      case "text":
        return (
          <label className={styles.inputLabel} key={index}>
            {elem.label}
            <input key={elem.key} type={elem.type} name={elem.key} value={formData[elem.key] || ""} onChange={handleInputChange} disabled={loading} />
          </label>
        );
      case "password":
        return (
          <PasswordInput
            key={index}
            elem={elem}
            value={formData[elem.key] || ""}
            onChange={(value: string) => setFormData({ ...formData, [elem.key]: value })}
            disabled={loading}
            isSignUp={isSignUp}
          />
        );
    }
  };

  function handleTermCheckBoxChange(isChecked: boolean) {
    setIsTermCheck(isChecked);
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        {elements.map((elem, index) => formSwitch(elem, index))}
        {isSignUp && (
          <CheckBox set={false} onChange={handleTermCheckBoxChange}>
            <div className={styles.checkBoxText}>
              I accept the{" "}
              <a href="/privacy-policy" className={styles.link} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>{" "}
              and the{" "}
              <a href="/terms-of-service" className={styles.link} target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
            </div>
          </CheckBox>
        )}
      </form>
      <div className={styles.buttonBox}>
        {loading ? (
          <Spinner size="l" />
        ) : (
          <button className={getButtonClassName(theme)} onClick={handleClick} disabled={isSignUp && !isTermCheck} style={{ width: buttonWidth }}>
            {buttonText}
          </button>
        )}
      </div>
    </>
  );
}

export default Form;
