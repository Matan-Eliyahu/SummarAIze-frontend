import { FaUserCircle } from "react-icons/fa";
import Layout from "../../components/Layout/Layout";
import styles from "./Account.module.scss";
import { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "../../components/Sidebar/Sidebar";
import { FaIdCard, FaUser } from "react-icons/fa6";
import AccountForm, { AccountSection } from "../../components/Forms/AccountForm/AccountForm";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../hooks/useStore";
import { IUser, PlanType } from "../../common/types";
import { AxiosError } from "../../services/UserService";
import { useAlert } from "../../hooks/useAlert";
import UploadService from "../../services/UploadService";
import useUserManager from "../../hooks/useUserManager";

export default function Account() {
  const { logout } = useAuth();
  const { account, loading, refreshStore } = useStore();
  const { updateUser, updateUserPlan } = useUserManager();
  const { setAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<AccountSection>("my-account");

  function handleSidebarSelect(settings: string) {
    setCurrentSection(settings as AccountSection);
  }

  const sidebarItems: SidebarItem[] = [
    { label: "My Account", value: "my-account", icon: <FaUser /> },
    { label: "My Plan", value: "my-plan", icon: <FaIdCard /> },
  ];

  useEffect(() => {
    refreshStore();
  }, []);

  async function handleUpdatePlan(plan: PlanType) {
    setIsLoading(true);
    try {
      await updateUserPlan(plan);
      await refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateUser(user: IUser) {
    setIsLoading(true);
    try {
      await updateUser(user);
      await refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout loading={loading || isLoading} text="Loading account...">
      {account && (
        <div className={styles.accountBox}>
          <div className={styles.sidebarBox}>
            <div className={styles.pageTitleBox}>
              <FaUserCircle className={styles.pageTitleIcon} />
              Account
            </div>
            <Sidebar items={sidebarItems} onSelect={handleSidebarSelect} isAccountSidebar onLogout={handleLogout} />
          </div>
          <AccountForm set={account!} onUserChange={handleUpdateUser} onPlanChange={handleUpdatePlan} onImageUpload={handleUploadUserImage} section={currentSection} />
        </div>
      )}
    </Layout>
  );
}
