import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/Home.module.scss";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { FaApple } from "react-icons/fa";
import { FormType } from "../common/types";
import Form from "../components/Form/Form";
import Welcome from "../components/Welcome/Welcome";

function Home() {
  const navigate = useNavigate();

  const signInForm: FormType = {
    formId: "signInForm",
    elements: [
      {
        label: "Email",
        name: "email",
        type: "email"
      },
      {
        label: "Password",
        name: "password",
        type: "password"
      },
    ],
    confirmButton: {
      text: "Sign In",
      className: "signinButton",
      handler: handleButtonClick
    }
  }

  function handleButtonClick() {
    navigate("summarize");
  }

  return (
    <div className="home">
      <Welcome />
      <div className={styles.buttonBox}>
        <Form formId={signInForm.formId} elements={signInForm.elements} confirmButton={signInForm.confirmButton}></Form>

        <div className={styles.boxSeparator}>
          <div className={styles.boxSeparatorLine}></div>
          <span className={styles.boxSeparatorItem}>or sign in with</span>
          <div className={styles.boxSeparatorLine}></div>
        </div>

        <button className={styles.googleButton} onClick={handleButtonClick}>
          <FcGoogle size={20} />
          Continue with Google
        </button>
        <button className={styles.facebookButton} onClick={handleButtonClick}>
          <MdFacebook size={20} className={styles.facebookIcon} />
          Continue with Facebook
        </button>
        <button className={styles.appleButton} onClick={handleButtonClick}>
          <FaApple size={20} className={styles.appleIcon} />
          Continue with Apple
        </button>

        <div className={styles.descriptionText}>Don't have an account yet?</div>
        <a href="/signup">Register now</a>
      </div>

      <div className={styles.descriptionText}>Start summarizing documents, photos, and recordings effortlessly. Experience the power of AI-driven summaries tailored to your needs</div>
    </div>
  );
}

export default Home;
