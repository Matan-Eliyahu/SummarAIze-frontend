import Layout from "../../components/Layout/Layout";
import { FaGear } from "react-icons/fa6";
import styles from "./Settings.module.scss";
import { useEffect } from "react";
import SettingsForm from "../../components/Forms/SettingsForm/SettingsForm";
import { ISettings, IUpdate } from "../../common/types";
import SettingsService, { AxiosError } from "../../services/SettingsService";
import { useError } from "../../hooks/useError";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../../hooks/useWebSocket";
import { useStore } from "../../hooks/useStore";

export default function Settings() {
  const { setAlert, clearAlert } = useError();
  const { settings, loading, refreshStore } = useStore();
  const navigate = useNavigate();
  const socket = useWebSocket();

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
  }, [socket]);

  useEffect(() => {
    refreshStore();
  }, []);

  async function updateUserSettings(updatedSettings: ISettings) {
    const { request } = SettingsService.updateSettingsByUserId(updatedSettings);
    try {
      await request;
      refreshStore();
      // navigate("/dashboard");
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
      {settings && <SettingsForm set={settings} onSubmit={handleUpdateSettings} />}
    </Layout>
  );
}
