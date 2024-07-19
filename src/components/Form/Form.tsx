import React, { useState } from "react";
import styles from "./Form.module.scss";
import PasswordInput from "./PasswordInput/PasswordInput";
import Spinner from "../Spinner/Spinner";

export interface FormProps {
  elements: FormElement[];
  buttonText: string;
  theme?: "primary" | "secondary" | "success";
  onSubmit: (formData: { [key: string]: string }) => void;
  loading: boolean;
}

export type FormElement = {
  label: string;
  key: string;
  type: "text" | "email" | "password";
};

function Form({ elements, buttonText, theme, onSubmit, loading }: FormProps) {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    onSubmit(formData);
  }

  function getButtonClassName(buttonTheme?: "primary" | "secondary" | "success") {
    if (!buttonTheme) return styles.primaryButton;
    switch (buttonTheme) {
      case "primary":
        return styles.primaryButton;
      case "secondary":
        return styles.secondaryButton;
      case "success":
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  }

  const formSwitch = (elem: FormElement, index: number): JSX.Element => {
    switch (elem.type) {
      case "email":
        return (
          <label className={styles.inputLabel} key={index}>
            {elem.label}
            <input key={elem.key} type={elem.type} name={elem.key} value={formData[elem.key] || ""} onChange={handleInputChange} disabled={loading} required/>
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
        return <PasswordInput key={index} elem={elem} value={formData[elem.key] || ""} onChange={(value: string) => setFormData({ ...formData, [elem.key]: value })} disabled={loading} />;
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        {elements.map((elem, index) => formSwitch(elem, index))}
      </form>
      <div className={styles.buttonBox}>
        {loading ? (
          <Spinner size="m" />
        ) : (
          <button className={getButtonClassName(theme)} onClick={handleClick}>
            {buttonText}
          </button>
        )}
      </div>
    </>
  );
}

export default Form;
