import React from "react";
import { FormType, InputFormElement } from "../../common/types";
import styles from "./Form.module.scss";
import PasswordInput from "./PasswordInput/PasswordInput";

const Form: React.FC<FormType> = (props) => {
  const { formId, elements, confirmButton } = props;

  const formSwitch = (elem: InputFormElement,key:number): JSX.Element => {
    switch (elem.type) {
      case "email":
      case "text":
        return (
          <label className={styles.inputLabel} key={key}>
            {elem.label}
            <input key={elem.name} type={elem.type} name={elem.name} className={styles.input} />
          </label>
        );
      case "password":
        return <PasswordInput elem={elem} key={key}></PasswordInput>;
      default:
        return <></>;
    }
  };

  return (
    <>
      <form id={formId} className={styles.form}>
        {elements.map((elem,index) => formSwitch(elem,index))}
      </form>
      <button id={`${formId}Btn`} className={styles[confirmButton.className]} onClick={(event) => console.log(event)}>
        {confirmButton.text}
      </button>
    </>
  );
};

export default Form;
