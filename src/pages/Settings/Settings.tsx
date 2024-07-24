import Layout from "../../components/Layout/Layout";
import { FaGear } from "react-icons/fa6";
import styles from "./Settings.module.scss";
import { useEffect, useState } from "react";
import SettingsForm from "../../components/Forms/SettingsForm/SettingsForm";
import { ISettings, IUpdate } from "../../common/types";
import SettingsService, { AxiosError } from "../../services/SettingsService";
import { useError } from "../../hooks/useError";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../../hooks/useWebSocket";

export default function Settings() {
  const { setAlert, clearAlert } = useError();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [loading, setLoading] = useState(false);
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

  async function fetchUserSettings() {
    const { request } = SettingsService.getSettingsByUserId();
    setLoading(true);
    try {
      const response = await request;
      const userSettings: ISettings = response.data;
      setSettings(userSettings);
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserSettings();
  }, []);

  async function updateUserSettings(updatedSettings: ISettings) {
    const { request } = SettingsService.updateSettingsByUserId(updatedSettings);
    setLoading(true);
    try {
      const response = await request;
      const userSettings: ISettings = response.data;
      setSettings(userSettings);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      setLoading(false);
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
