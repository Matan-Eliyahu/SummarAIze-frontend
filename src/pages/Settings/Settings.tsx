import Layout from "../../components/Layout/Layout";
import { FaGear } from "react-icons/fa6";
import styles from "./Settings.module.scss";
import { useEffect, useState } from "react";
import SettingsForm from "../../components/Forms/SettingsForm/SettingsForm";
import { ISettings } from "../../common/types";
import { useAuth } from "../../hooks/useAuth";
import SettingsService, { AxiosError } from "../../services/SettingsService";
import { useError } from "../../hooks/useError";

export default function Settings() {
  const { auth } = useAuth();
  const { setAlert } = useError();
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchUserSettings() {
    if (!auth) return;
    const { request } = SettingsService.getSettingsByUserId(auth.id);
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

  async function updateUserSettings(updatedSettings: ISettings) {
    if (!auth) return;
    const { request } = SettingsService.updateSettingsByUserId(auth.id, updatedSettings);
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

  async function handleUpdateSettings(newSettings: ISettings) {
    if (newSettings.allowedFileTypes.length === 0) {
      setAlert({ text: "You must check at least one file type" });
    }
    await updateUserSettings(newSettings);
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
