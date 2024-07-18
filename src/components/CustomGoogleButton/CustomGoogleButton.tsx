import { useAuth } from "../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import styles from "./CustomGoogleButton.module.scss";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";

export default function CustomGoogleButton() {
  const { googleLogin } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse:TokenResponse) => {
      console.log(tokenResponse);
      googleLogin(tokenResponse)
    },
  });

  return (
    <button className={styles.googleButton} onClick={() => handleGoogleLogin()}>
      <FcGoogle className={styles.googleIcon} />
      Google
    </button>
  );
}
