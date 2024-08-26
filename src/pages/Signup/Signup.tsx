import Form, { FormElement } from "../../components/Forms/Form";
import Welcome from "../../components/Welcome/Welcome";
import styles from "./Signup.module.scss";
import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import PlanSelection from "../PlanSelection/PlanSelection";
import AuthService, { AxiosError } from "../../services/AuthService";
import { useAlert } from "../../hooks/useAlert";

export interface SignUpFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

function Signup() {
  const { setAlert } = useAlert();
  const [signupFormDate, sestSignupFormData] = useState<SignUpFormData | null>(null);
  const [loading, setLoading] = useState(false);

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
    const email = formData.email;
    if (!email) return;

    setLoading(true);
    const { request } = AuthService.checkEmail(email);
    try {
      await request;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      return;
    } finally {
      setLoading(false);
    }

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
    <Layout fullPage loading={loading} text="Signing up...">
      <div className={styles.signupContainer}>
        <div className={styles.signupBox}>
          <div className={styles.title}>Create your account</div>
          <Form isSignUp elements={signupElements} buttonText="Sign Up" theme="secondary" onSubmit={handleRegister} buttonWidth="60%" />
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
