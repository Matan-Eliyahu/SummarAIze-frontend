import { ReactNode } from "react";
import styles from "./Modal.module.scss";

export interface ModalProps {
  element: ReactNode;
}

function Modal({ element }: ModalProps) {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBox}>{element}</div>
    </div>
  );
}

export default Modal;
