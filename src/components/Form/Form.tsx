import React from 'react';
import { FormType } from "../../common/types";
import styles from "./Form.module.scss";

const Form: React.FC<FormType> = (props) => {
    const { formId, elements, confirmButton } = props
    return (
        <>
            <form id={formId} className={styles.form}>
                {elements.map(elem => {
                    return (
                        <label key={`${elem.name}Lbl`}>
                            {elem.label}
                            <input key={elem.name} type={elem.type} name={elem.name} className={styles.input} />
                        </label>

                    )
                })}
            </form>
            <button id={`${formId}Btn`} className={styles[confirmButton.className]} onClick={() => confirmButton.handler()}>
                {confirmButton.text}
            </button>
        </>

    );
}

export default Form;