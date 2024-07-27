import { useAuth } from "../../hooks/useAuth";
// import { MdFacebook } from "react-icons/md";
// import { FaApple } from "react-icons/fa";
import Form, { FormElement } from "../../components/Forms/Form";
import Welcome from "../../components/Welcome/Welcome";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { FcGoogle } from "react-icons/fc";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import { useError } from "../../hooks/useError";
import styles from "./Login.module.scss";
import PlanSelection from "../PlanSelection/PlanSelection";

export interface GoogleSignupData {
  tokenResponse: TokenResponse;
}

function Home() {
  const { login, googleLogin } = useAuth();
  const { setAlert, clearAlert } = useError();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [googleSignupData, setGoogleSignupData] = useState<GoogleSignupData | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const signinElements: FormElement[] = [
    {
      label: "Email Address",
      key: "email",
      type: "email",
    },
    {
      label: "Password",
      key: "password",
      type: "password",
    },
  ];

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      setLoading(true);
      try {
        const signed = await googleLogin(tokenResponse);
        if (!signed) {
          // No plan
          console.log("NO PLAN");
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

        <div className={`${styles.singinBox} ${isVisible ? styles.visible : ""}`}>
          <div>Log in to your account</div>

          <Form elements={signinElements} buttonText="Log In" onSubmit={handleLogin} loading={loading} />
          <div className={styles.boxSeparator}>
            <div className={styles.boxSeparatorLine}></div>
            <span className={styles.boxSeparatorItem}>Or sign with</span>
            <div className={styles.boxSeparatorLine}></div>
          </div>
          <div className={styles.buttonBox}>
            <button className={styles.googleButton} onClick={() => handleGoogleLogin()}>
              <FcGoogle className={styles.googleIcon} />
              Google
            </button>
          </div>
          <div className={styles.signupBox}>
            <div className={styles.lightText}>Don't have an account?</div>
            <a href="/signup">Sign Up</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
