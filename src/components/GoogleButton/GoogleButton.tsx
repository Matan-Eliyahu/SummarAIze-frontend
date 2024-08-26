import { FcGoogle } from "react-icons/fc";
import styles from "./GoogleButton.module.scss";
import { OverridableTokenClientConfig } from "@react-oauth/google";

interface GoogleButtonProps {
  onLogin: (overrideConfig?: OverridableTokenClientConfig) => void;
}

export default function GoogleButton({ onLogin }: GoogleButtonProps) {
  return (
    <button className={styles.googleButton} onClick={() => onLogin()}>
      <FcGoogle className={styles.googleIcon} />
      Google
    </button>
  );
}
