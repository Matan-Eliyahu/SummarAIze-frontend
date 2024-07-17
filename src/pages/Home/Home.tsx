import { useAuth } from "../../hooks/useAuth";
// import { FcGoogle } from "react-icons/fc";
// import { MdFacebook } from "react-icons/md";
// import { FaApple } from "react-icons/fa";
import { FormType } from "../../common/types";
import Form from "../../components/Form/Form";
import Welcome from "../../components/Welcome/Welcome";
import styles from "./Home.module.scss";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

function Home() {
  const { login, googleSignin } = useAuth();

  const signInForm: FormType = {
    formId: "signInForm",
    elements: [
      {
        label: "Email",
        name: "email",
        type: "email",
      },
      {
        label: "Password",
        name: "password",
        type: "password",
      },
    ],
    confirmButton: {
      text: "Sign In",
      className: "signinButton",
      handler: handleLogin,
    },
  };

  async function handleLogin(formData: { [key: string]: string }) {
    const { email, password } = formData;
    await login(email, password);
  }

  async function onGoogleLoginSuccess(credentialResponse: CredentialResponse) {
    console.log(credentialResponse);
    await googleSignin(credentialResponse);
  }

  function onGoogleLoginFailure() {
    console.log("Google login failed");
  }

  return (
    <div className="home">
      <div className={styles.homeBox}>
        <div className={styles.welcomeBox}>
          <Welcome />
          <div className={styles.descriptionText}>Start summarizing documents, photos, and recordings effortlessly. Experience the power of AI-driven summaries tailored to your needs</div>
        </div>

        <div className={styles.buttonBox}>
          <Form formId={signInForm.formId} elements={signInForm.elements} confirmButton={signInForm.confirmButton} />
          <div className={styles.boxSeparator}>
            <div className={styles.boxSeparatorLine}></div>
            <span className={styles.boxSeparatorItem}>Sign in with</span>
            <div className={styles.boxSeparatorLine}></div>
          </div>

          <GoogleLogin theme="outline" width={270} locale="en" logo_alignment="center" text="continue_with" onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />

          {/* <button className={styles.googleButton} onClick={() => navigate("signup")}>
            <FcGoogle size={20} />
            Continue with Google
          </button>
          <button className={styles.facebookButton} onClick={() => navigate("signup")}>
            <MdFacebook size={20} className={styles.facebookIcon} />
            Continue with Facebook
          </button>
          <button className={styles.appleButton} onClick={() => navigate("signup")}>
            <FaApple size={20} className={styles.appleIcon} />
            Continue with Apple
          </button> */}
          <div className={styles.signupBox}>
            <div className={styles.descriptionText}>Don't have an account yet?</div>
            <a href="/signup">Register now</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
