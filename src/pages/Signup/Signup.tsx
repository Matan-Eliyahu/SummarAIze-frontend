import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FormType, IUser } from "../../common/types";
import Form from "../../components/Form/Form";
import Welcome from "../../components/Welcome/Welcome";
import styles from "./Signup.module.scss";

function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const signUpForm: FormType = {
    formId: "signUpForm",
    elements: [
      {
        label: "Username",
        name: "username",
        type: "text",
      },
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
      {
        label: "confirm Password",
        name: "confirmPassword",
        type: "password",
      },
    ],
    confirmButton: {
      text: "Sign Up",
      className: "signupButton",
      handler: handleRegister,
    },
  };

  async function handleRegister(formData: { [key: string]: string }) {
    const { email, username, password } = formData;
    const user: IUser = {
      email,
      fullName: username,
      password,
    };
    await register(user);
    navigate("/");
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

export default Signup;
