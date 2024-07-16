import React, { useState } from "react";
import { InputFormElement, FormType } from "../../common/types";
import styles from "./Form.module.scss";
import PasswordInput from "./PasswordInput/PasswordInput";

const Form: React.FC<FormType> = (props) => {
  const { formId, elements, confirmButton } = props;

  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted with data:", formData);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    confirmButton.handler(formData);
  };

  const formSwitch = (elem: InputFormElement, index: number): JSX.Element => {
    switch (elem.type) {
      case "email":
      case "text":
        return (
          <label className={styles.inputLabel} key={index}>
            {elem.label}
            <input key={elem.name} type={elem.type} name={elem.name} value={formData[elem.name] || ""} onChange={handleInputChange} className={styles.input} />
          </label>
        );
      case "password":
        return <PasswordInput key={index} elem={elem} value={formData[elem.name] || ""} onChange={(value: string) => setFormData({ ...formData, [elem.name]: value })} />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <form id={formId} className={styles.form} onSubmit={handleSubmit}>
        {elements.map((elem, index) => formSwitch(elem, index))}
      </form>
      <button id={`${formId}Btn`} className={styles[confirmButton.className]} onClick={handleClick}>
        {confirmButton.text}
      </button>
    </>
  );
};

export default Form;
