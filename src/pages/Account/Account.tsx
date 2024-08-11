import { FaUserCircle } from "react-icons/fa";
import Layout from "../../components/Layout/Layout";
import styles from "./Account.module.scss";
import { useState } from "react";
import Sidebar, { SidebarItem } from "../../components/Sidebar/Sidebar";
import { FaIdCard, FaUser } from "react-icons/fa6";
import AccountForm, { AccountSection } from "../../components/Forms/AccountForm/AccountForm";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../hooks/useStore";
import { IUser, PlanType } from "../../common/types";
import { AxiosError } from "../../services/UserService";
import { useError } from "../../hooks/useError";

export default function Account() {
  const { loadingAuth } = useAuth();
  const { account, refreshStore, updateUser, updateUserPlan } = useStore();
  const { setAlert } = useError();
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<AccountSection>("my-account");

  const sidebarItems: SidebarItem[] = [
    { label: "My Account", value: "my-account", icon: <FaUser /> },
    { label: "My Plan", value: "my-plan", icon: <FaIdCard /> },
  ];

  async function handleUpdatePlan(plan: PlanType) {
    setLoading(true);
    try {
      await updateUserPlan(plan);
      await refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateUser(user: IUser) {
    setLoading(true);
    try {
      await updateUser(user);
      await refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout loading={loadingAuth || loading} text="Loading account...">
      <div className="pageTitleBox">
        <FaUserCircle className={styles.titleIcon} />
        Account
      </div>
      <div className={styles.accountBox}>
        <div className={styles.sidebarBox}>
          <Sidebar items={sidebarItems} onSelect={(settings) => setCurrentSection(settings as AccountSection)} />
        </div>
        <AccountForm set={account!} onUserChange={handleUpdateUser} onPlanChange={handleUpdatePlan} section={currentSection} />
      </div>
    </Layout>
  );
}
