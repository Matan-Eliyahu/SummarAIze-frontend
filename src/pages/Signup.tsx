
import { useNavigate } from "react-router-dom";
import { FormType } from "../common/types";
import styles from "../styles/pages/Home.module.scss";
import Form from "../components/Form/Form";
import Welcome from "../components/Welcome/Welcome";

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
      <Welcome />
      <div className={styles.buttonBox}>
        <Form formId={signUpForm.formId} elements={signUpForm.elements} confirmButton={signUpForm.confirmButton}></Form>
        <div className={styles.descriptionText}>already have an account?</div>
        <a href="/">Sign in</a>
      </div>
    </div>
  );
}

export default Signup
