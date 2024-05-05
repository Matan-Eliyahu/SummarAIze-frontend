import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-large.png";
import pdfIcon from "../assets/pdf-icon.png";
import docIcon from "../assets/doc-icon.png";
import audoiIcon from "../assets/audio-icon.png";
import styles from "../styles/pages/Home.module.scss";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { FormType } from "../common/types";
import Form from "../components/Form/Form";

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
      <div className={styles.welcomeBox}>
        <div className={styles.welcomeText}>Welcome to</div>
        <img src={logo} alt="logo" style={{ width: "370px" }} />
      </div>

      <div className={styles.catchwordBox}>
        <div className={styles.catchwordText}>Transforming Text with AI</div>
        <div className={styles.iconBox}>
          <img src={pdfIcon} alt="pdf-icon" className={styles.icon} />
          <img src={docIcon} alt="doc-icon" className={styles.icon} />
          <img src={audoiIcon} alt="audio-icon" className={styles.icon} />
        </div>
      </div>

      <div className={styles.buttonBox}>
      <Form formId={signInForm.formId} elements={signInForm.elements} confirmButton={signInForm.confirmButton}></Form>

        <div className={styles.boxSeparator}>
          <hr className={styles.boxSeparatorItem}></hr>
          <span className={styles.boxSeparatorItem}>or sign in with</span>
          <hr className={styles.boxSeparatorItem}></hr>
        </div>

        <button className={styles.googleButton} onClick={handleButtonClick}>
          <FcGoogle size={25} />
          Continue with Google
        </button>
        <button className={styles.facebookButton} onClick={handleButtonClick}>
          <MdFacebook size={25} className={styles.facebookIcon} />
          Continue with Facebook
        </button>
        <button className={styles.appleButton} onClick={handleButtonClick}>
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
