import { useState } from "react";
import { IUser, PLANS, PlanType } from "../../common/types";
import Layout from "../../components/Layout/Layout";
import PlanCard from "../../components/PlanCard/PlanCard";
import { useError } from "../../hooks/useError";
import styles from "./PlanSelection.module.scss";
import { useAuth } from "../../hooks/useAuth";
import { AxiosError } from "axios";
import UserService from "../../services/UserService";
import { SignUpFormData } from "../Signup/Signup";
import { GoogleSignupData } from "../Login/Login";

interface PlanSelectionProps {
  signupFormData?: SignUpFormData;
  googleSignupData?: GoogleSignupData;
}

export default function PlanSelection({ signupFormData, googleSignupData }: PlanSelectionProps) {
  const { register, login, googleLogin } = useAuth();
  const { setAlert } = useError();
  const [loading, setLoading] = useState(false);

  async function hanldeRegister(plan: PlanType) {
    if (googleSignupData) {
      const { tokenResponse } = googleSignupData;
      const { request } = UserService.updatePlan(plan);
      setLoading(true);
      try {
        await request;
        await googleLogin(tokenResponse);
      } catch (error) {
        if (error instanceof AxiosError) handleAlert(error);
      } finally {
        setLoading(false);
      }
    } else if (signupFormData) {
      const { email, firstName, lastName, password } = signupFormData;
      const user: IUser = {
        email,
        plan: plan,
        fullName: firstName + " " + lastName,
        imageUrl: "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg",
        password,
      };
      setLoading(true);
      try {
        await register(user);
        await login(email, password);
      } catch (error) {
        if (error instanceof AxiosError) handleAlert(error);
      } finally {
        setLoading(false);
      }
    }
  }

  function handleAlert(error: AxiosError) {
    setLoading(false);
    setAlert({
      error,
    });
  }

  return (
    <Layout fullPage loading={loading}>
      <div className={styles.planSelectionBox}>
        <h2>Choose Your Plan</h2>
        <div className={styles.planSelectionButtonBox}>
          {Object.values(PLANS)
            .filter((plan) => plan != null)
            .map((plan, index) => (
              <PlanCard plan={plan} key={index} onChoosePlan={hanldeRegister} loading={loading} />
            ))}
        </div>
      </div>
    </Layout>
  );
}
