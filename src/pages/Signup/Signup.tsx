import Form, { FormElement } from "../../components/Forms/Form";
import Welcome from "../../components/Welcome/Welcome";
import styles from "./Signup.module.scss";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import PlanSelection from "../PlanSelection/PlanSelection";

export interface SignUpFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

function Signup() {
  const [isVisible, setIsVisible] = useState(false);
  const [signupFormDate, sestSignupFormData] = useState<SignUpFormData | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const signupElements: FormElement[] = [
    {
      label: "Email Address",
      key: "email",
      type: "email",
    },
    {
      label: "First Name",
      key: "firstName",
      type: "text",
    },
    {
      label: "Last Name",
      key: "lastName",
      type: "text",
    },
    {
      label: "Password",
      key: "password",
      type: "password",
    },
  ];

  async function handleRegister(formData: { [key: string]: string }) {
    const signupFormData: SignUpFormData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
    };
    sestSignupFormData(signupFormData);
  }

  if (signupFormDate !== null) return <PlanSelection signupFormData={signupFormDate} />;

  return (
    <Layout fullPage>
      <div className={styles.signupContainer}>
        <div className={`${styles.signupBox} ${isVisible ? styles.visible : ""}`}>
          <div>Create your account</div>
          <Form isSignUp elements={signupElements} buttonText="Sign Up" theme="secondary" onSubmit={handleRegister}></Form>
          <div className={styles.signinBox}>
            <div className={styles.lightText}>Already have an account?</div>
            <a href="/">Log in</a>
          </div>
        </div>
        <Welcome mode="sign-up" />
      </div>
    </Layout>
  );
}

export default Signup;
