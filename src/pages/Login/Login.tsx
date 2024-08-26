import { useState } from "react";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../../components/Layout/Layout";
import Welcome from "../../components/Welcome/Welcome";
import LoginForm from "../../components/Forms/LoginForm/LoginForm";
import PlanSelection from "../PlanSelection/PlanSelection";
import styles from "./Login.module.scss";
import { SuccessResponse } from "@greatsumini/react-facebook-login";

export interface GoogleSignupData {
  tokenResponse: TokenResponse;
}

export interface FacebookSignupData {
  accessToken: string;
}

function Login() {
  const { login, googleLogin, facebookLogin, loadingAuth } = useAuth();
  const [googleSignupData, setGoogleSignupData] = useState<GoogleSignupData | null>(null);
  const [facebookSignupData, setFacebookSignupData] = useState<FacebookSignupData | null>(null);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      const { initialized, error } = await googleLogin(tokenResponse);
      if (!initialized && !error) {
        setGoogleSignupData({ tokenResponse });
      }
    },
  });

  async function handleFacebookLogin(respose: SuccessResponse) {
    const accessToken = respose.accessToken;
    const { initialized, error } = await facebookLogin(accessToken);
    if (!initialized && !error) {
      setFacebookSignupData({ accessToken });
    }
  }

  async function handleLogin(formData: { [key: string]: string }) {
    const { email, password } = formData;
    await login(email, password);
  }

  if (googleSignupData) return <PlanSelection googleSignupData={googleSignupData} />;
  else if (facebookSignupData) return <PlanSelection facebookSignupData={facebookSignupData} />;

  return (
    <Layout fullPage>
      <div className={styles.homeBox}>
        <div className={styles.welcomeBox}>
          <Welcome mode="home" />
        </div>
        <LoginForm onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onFacebookLogin={handleFacebookLogin} loading={loadingAuth} />
      </div>
    </Layout>
  );
}

export default Login;
