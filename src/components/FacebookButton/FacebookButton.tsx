import FacebookLogin, { SuccessResponse } from "@greatsumini/react-facebook-login";
import { FaFacebook } from "react-icons/fa6";
import styles from "./FacebookButton.module.scss";

interface FacebookButtonProps {
  onLogin: (response: SuccessResponse) => void;
}

export default function FacebookButton({ onLogin }: FacebookButtonProps) {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID;

  return (
    <FacebookLogin
      appId={appId}
      onSuccess={onLogin}
      onFail={(error) => {
        console.log("Facebook Login Failed!", error);
      }}
      className={styles.facebookButton}
    >
      <FaFacebook className={styles.facebookIcon} />
      Facebook
    </FacebookLogin>
  );
}
