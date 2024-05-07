import React from 'react';
import { FormType, InputFormElement } from "../../common/types";
import styles from "./Form.module.scss";
import PasswordInput from '../passwordInput/passwordInput';

const Form: React.FC<FormType> = (props) => {
    const { formId, elements, confirmButton } = props
    
    const formSwitch = (elem: InputFormElement): JSX.Element => {
        switch (elem.type) {
            case 'email':
            case 'text':
                return <label key={`${elem.name}Lbl`}>
                            {elem.label}
                            <input key={elem.name} type={elem.type} name={elem.name} className={styles.input} />
                        </label>
            case 'password':
                return <PasswordInput elem={elem}></PasswordInput>
            default:
                return <></>;
        }
    }

    return (
        <>
            <form id={formId} className={styles.form}>
                {elements.map(elem => formSwitch(elem) )}
            </form>
            <button id={`${formId}Btn`} className={styles[confirmButton.className]} onClick={() => confirmButton.handler()}>
                {confirmButton.text}
            </button>
        </>

    );
}

export default Form;