import Layout from "../../components/Layout/Layout";
import { FaFile, FaFolder, FaGear } from "react-icons/fa6";
import styles from "./Settings.module.scss";
import { useEffect, useState } from "react";
import SettingsForm, { SettingsSection } from "../../components/Forms/SettingsForm/SettingsForm";
import { ISettings, IUpdate } from "../../common/types";
import SettingsService, { AxiosError } from "../../services/SettingsService";
import { useError } from "../../hooks/useError";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../../hooks/useWebSocket";
import { useStore } from "../../hooks/useStore";
import Sidebar, { SidebarItem } from "../../components/Sidebar/Sidebar";

export default function Settings() {
  const { settings, loading, refreshStore } = useStore();
  const { setAlert, clearAlert } = useError();
  const navigate = useNavigate();
  const socket = useWebSocket();
  const [currentSection, setCurrentSection] = useState<SettingsSection>("file-management");

  function handleSidebarSelect(section: SettingsSection) {
    setCurrentSection(section);
  }

  const sidebarItems: SidebarItem[] = [
    { label: "File Managment", value: "file-management", icon: <FaFolder /> },
    { label: "Summary Options", value: "summary-options", icon: <FaFile /> },
  ];

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const update: IUpdate = JSON.parse(event.data);
        const text = update.status === "completed" ? `${update.fileName} has been successfully processed` : `Processing failed for ${update.fileName}`;
        setAlert({
          text,
          secondButtonText: "Go to file",
          secondButtonColor: "secondary",
          onSecondButtonClick: () => {
            clearAlert();
            navigate(`/dashboard/${update.fileName}`);
          },
        });
      };
    }
  }, [socket,]);

  useEffect(() => {
    refreshStore();
  }, []);

  async function updateUserSettings(updatedSettings: ISettings) {
    const { request } = SettingsService.updateSettingsByUserId(updatedSettings);
    try {
      await request;
      refreshStore();
      // setTimeout(() => {
      //   navigate("/dashboard");
      // }, 1000);
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
      <div className="pageTitleBox">
        <FaGear className={styles.titleIcon} />
        Settings
      </div>
      {settings && (
        <div className={styles.settingsBox}>
          <div className={styles.sidebarBox}>
            <Sidebar items={sidebarItems} onSelect={(setting) => handleSidebarSelect(setting as SettingsSection)} />
          </div>
          <SettingsForm set={settings} onSubmit={handleUpdateSettings} section={currentSection} />
        </div>
      )}
    </Layout>
  );
}
