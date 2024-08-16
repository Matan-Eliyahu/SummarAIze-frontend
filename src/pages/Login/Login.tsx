import { useState } from "react";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "../../hooks/useAlert";
import { AxiosError } from "axios";
import Layout from "../../components/Layout/Layout";
import Welcome from "../../components/Welcome/Welcome";
import LoginForm from "../../components/Forms/LoginForm/LoginForm";
import PlanSelection from "../PlanSelection/PlanSelection";
import styles from "./Login.module.scss";

export interface GoogleSignupData {
  tokenResponse: TokenResponse;
}

function Login() {
  const { login, googleLogin } = useAuth();
  const { setAlert, clearAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [googleSignupData, setGoogleSignupData] = useState<GoogleSignupData | null>(null);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      setLoading(true);
      try {
        const signed = await googleLogin(tokenResponse);
        if (!signed) {
          // No plan found
          const googleSignupData: GoogleSignupData = {
            tokenResponse,
          };
          setGoogleSignupData(googleSignupData);
        }
      } catch (error) {
        if (error instanceof AxiosError) handleAlert(error);
      }
    },
  });

  async function handleLogin(formData: { [key: string]: string }) {
    const { email, password } = formData;
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      if (error instanceof AxiosError) handleAlert(error);
    }
  }

  function handleAlert(error: AxiosError) {
    setAlert({
      error,
      onButtonClick: () => {
        setLoading(false);
        clearAlert();
      },
    });
  }

  if (googleSignupData) return <PlanSelection googleSignupData={googleSignupData} />;

  return (
    <Layout fullPage>
      <div className={styles.homeBox}>
        <div className={styles.welcomeBox}>
          <Welcome mode="home" />
        </div>
        <LoginForm onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} loading={loading} />
      </div>
    </Layout>
  );
}

export default Login;
