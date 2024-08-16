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
import { useAlert } from "../../hooks/useAlert";
import UploadService from "../../services/UploadService";

export default function Account() {
  const { logout } = useAuth();
  const { account, refreshStore, updateUser, updateUserPlan } = useStore();
  const { setAlert } = useAlert();
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

  async function handleUploadUserImage(image: File) {
    try {
      const respose = await UploadService.uploadProfilePicture(image).request;
      return respose.data.imageUrl;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      return "";
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout loading={loading} text="Loading account...">
      <div className={styles.accountBox}>
        <div className={styles.sidebarBox}>
          <div className="pageTitleBox">
            <FaUserCircle className={styles.titleIcon} />
            Account
          </div>
          <Sidebar items={sidebarItems} onSelect={(settings) => setCurrentSection(settings as AccountSection)} isAccountSidebar onLogout={handleLogout} />
        </div>
        <AccountForm set={account!} onUserChange={handleUpdateUser} onPlanChange={handleUpdatePlan} onImageUpload={handleUploadUserImage} section={currentSection} />
      </div>
    </Layout>
  );
}
