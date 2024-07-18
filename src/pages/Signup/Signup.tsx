import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { IUser } from "../../common/types";
import Form, { FormElement } from "../../components/Form/Form";
import Welcome from "../../components/Welcome/Welcome";
import styles from "./Signup.module.scss";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useError } from "../../hooks/useError";
import Layout from "../../components/Layout/Layout";

function Signup() {
  const { register } = useAuth();
  const { setAlert } = useError();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const signupElements: FormElement[] = [
    {
      label: "Username",
      key: "username",
      type: "text",
    },
    {
      label: "Email",
      key: "email",
      type: "email",
    },
    {
      label: "Password",
      key: "password",
      type: "password",
    },
    {
      label: "confirm Password",
      key: "confirmPassword",
      type: "password",
    },
  ];

  async function handleRegister(formData: { [key: string]: string }) {
    const { email, username, password } = formData;
    const user: IUser = {
      email,
      fullName: username,
      imageUrl: "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg",
      password,
    };
    setLoading(true);
    try {
      await register(user);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error instanceof AxiosError) setAlert({ error });
    }
  }

  return (
    <Layout fullPage loading={loading}>
      <div className={styles.signupContainer}>
        <div className={`${styles.signupBox} ${isVisible ? styles.visible : ""}`}>
          <div>Create your account</div>
          <Form elements={signupElements} buttonText="Sign Up" theme="secondary" onSubmit={handleRegister} loading={loading}></Form>
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
