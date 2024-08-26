import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "../../hooks/useAlert";
import { AxiosError } from "axios";
import UserService from "../../services/UserService";
import { IUser, PLANS, PlanType } from "../../common/types";
import Layout from "../../components/Layout/Layout";
import PlanCard from "../../components/PlanCard/PlanCard";
import { FacebookSignupData, GoogleSignupData } from "../Login/Login";
import { SignUpFormData } from "../Signup/Signup";
import styles from "./PlanSelection.module.scss";

interface PlanSelectionProps {
  signupFormData?: SignUpFormData;
  googleSignupData?: GoogleSignupData;
  facebookSignupData?: FacebookSignupData;
}

export default function PlanSelection({ signupFormData, googleSignupData, facebookSignupData }: PlanSelectionProps) {
  const { register, login, googleLogin, facebookLogin } = useAuth();
  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  async function hanldeRegister(plan: PlanType) {
    if (googleSignupData) {
      const { tokenResponse } = googleSignupData;
      const { request } = UserService.updateUserPlan(plan);
      setLoading(true);
      try {
        await request;
        await googleLogin(tokenResponse);
      } catch (error) {
        if (error instanceof AxiosError) handleAlert(error);
      } finally {
        setLoading(false);
      }
    } else if (facebookSignupData) {
      const { accessToken } = facebookSignupData;
      const { request } = UserService.updateUserPlan(plan);
      setLoading(true);
      try {
        await request;
        await facebookLogin(accessToken);
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
        imageUrl: "",
        password,
        registrationMethod: "manual",
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
    <Layout fullPage loading={loading} text="Signing up...">
      <div className={styles.planSelectionBox}>
        <div className={styles.title}>Choose Your Plan</div>
        <div className={styles.planSelectionButtonBox}>
          {(Object.keys(PLANS) as PlanType[])
            .filter((planType) => planType != "none")
            .map((planType, index) => (
              <PlanCard planType={planType} key={index} onChoosePlan={hanldeRegister} loading={loading} width="20%" />
            ))}
        </div>
      </div>
    </Layout>
  );
}
