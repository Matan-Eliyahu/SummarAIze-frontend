import Form from "../Form";
import { FormElement } from "../Form";
import FacebookButton from "../../FacebookButton/FacebookButton";
import GoogleButton from "../../GoogleButton/GoogleButton";
import { SuccessResponse } from "@greatsumini/react-facebook-login";
import { OverridableTokenClientConfig } from "@react-oauth/google";
import styles from "./LoginForm.module.scss";

interface LoginFormProps {
  loading: boolean;
  onLogin: (formData: { [key: string]: string }) => void;
  onGoogleLogin: (overrideConfig?: OverridableTokenClientConfig) => void;
  onFacebookLogin: (response: SuccessResponse) => void;
}

export default function LoginForm({ loading, onLogin, onGoogleLogin, onFacebookLogin }: LoginFormProps) {
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

  return (
    <div className={styles.singinBox}>
      <div className={styles.title}>Log in to your account</div>
      <Form elements={signinElements} buttonText="Log In" onSubmit={onLogin} loading={loading} buttonWidth="60%" />
      <div className={styles.boxSeparator}>
        <div className={styles.boxSeparatorLine}></div>
        <span className={styles.boxSeparatorItem}>Or sign with</span>
        <div className={styles.boxSeparatorLine}></div>
      </div>
      <div className={styles.buttonBox}>
        <GoogleButton onLogin={onGoogleLogin} />
        <FacebookButton onLogin={onFacebookLogin} />
      </div>
      <div className={styles.signupBox}>
        <div className={styles.lightText}>Don't have an account?</div>
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}
