import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../hooks/useAlert";
import { useStore } from "../../hooks/useStore";
import SettingsService, { AxiosError } from "../../services/SettingsService";
import Layout from "../../components/Layout/Layout";
import { ISettings } from "../../common/types";
import Sidebar, { SidebarItem } from "../../components/Sidebar/Sidebar";
import SettingsForm, { SettingsSection } from "../../components/Forms/SettingsForm/SettingsForm";
import { FaFile, FaFolder, FaGear } from "react-icons/fa6";
import styles from "./Settings.module.scss";

export default function Settings() {
  const { settings, loading, refreshStore } = useStore();
  const { setAlert } = useAlert();

  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<SettingsSection>("file-management");

  function handleSidebarSelect(section: SettingsSection) {
    setCurrentSection(section);
  }

  const sidebarItems: SidebarItem[] = [
    { label: "File Managment", value: "file-management", icon: <FaFolder /> },
    { label: "Summary Options", value: "summary-options", icon: <FaFile /> },
  ];

  useEffect(() => {
    refreshStore();
  }, []);

  async function updateUserSettings(updatedSettings: ISettings) {
    const { request } = SettingsService.updateSettingsByUserId(updatedSettings);
    try {
      await request;
      await refreshStore();
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    }
  }

  async function handleUpdateSettings(newSettings: ISettings) {
    if (newSettings.allowedFileTypes.length === 0) {
      setAlert({ text: "You must check at least one file type" });
    } else {
      await updateUserSettings(newSettings);
    }
  }

  return (
    <Layout loading={loading} text="Loading settings...">
      {settings && (
        <div className={styles.settingsBox}>
          <div className={styles.sidebarBox}>
            <div className={styles.pageTitleBox}>
              <FaGear className={styles.pageTitleIcon} />
              Settings
            </div>
            <Sidebar items={sidebarItems} onSelect={(setting) => handleSidebarSelect(setting as SettingsSection)} />
          </div>
          <SettingsForm set={settings} onSubmit={handleUpdateSettings} section={currentSection} />
        </div>
      )}
    </Layout>
  );
}
