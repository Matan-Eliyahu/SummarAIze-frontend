
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-large.png";
import pdfIcon from "../assets/pdf-icon.png";
import docIcon from "../assets/doc-icon.png";
import audoiIcon from "../assets/audio-icon.png";
import styles from "../styles/pages/Home.module.scss";
import Form from "../components/Form/Form";
import { FormType } from "../common/types";

function Signup() {

  const navigate = useNavigate();

  const signUpForm: FormType = {
    formId: "signUpForm",
    elements: [
      {
        label: "Username",
        name: "username",
        type: "text"
      },
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
      {
        label: "confirm Password",
        name: "confirmPassword",
        type: "password"
      },
    ],
    confirmButton: {
      text: "Sign Up",
      className: "signupButton",
      handler: handleButtonClick
    }
  }

  function handleButtonClick() {
    //vlidations and send to server 
    navigate("summarize");
  }

  return (
    <div className="signup">
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
        <Form formId={signUpForm.formId} elements={signUpForm.elements} confirmButton={signUpForm.confirmButton}></Form>
        <div className={styles.descriptionText}>already have an account?</div>
        <a href="/">Sign in</a>
      </div>
    </div>
  );
}

export default Signup
