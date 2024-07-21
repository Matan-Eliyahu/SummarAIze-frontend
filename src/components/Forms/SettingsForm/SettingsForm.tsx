import { useEffect, useState } from "react";
import Switch from "../../Switch/Switch";
import CheckBox from "../../CheckBox/CheckBox";
import Select from "../../Select/Select";
import { FileType, ISettings } from "../../../common/types";
import styles from "./SettingsForm.module.scss";

interface SettingsFormProps {
  set: ISettings;
  onSubmit: (updatedSettings: ISettings) => void;
}

export default function SettingsForm({ set, onSubmit }: SettingsFormProps) {
  const [settings, setSettings] = useState<ISettings>(set);
  const [isChanged, setIsChanged] = useState(set !== settings);

  const clearFilesOptions = [
    { value: 90, label: "After 90 days" },
    { value: 60, label: "After 60 days" },
    { value: 30, label: "After 30 days" },
    { value: 0, label: "Never" },
  ];

  useEffect(() => {
    setIsChanged(JSON.stringify(set) !== JSON.stringify(settings));
  }, [settings, set]);

  function handleCheckBoxChange(fileType: FileType, isChecked: boolean) {
    setSettings((prev) => ({
      ...prev,
      allowedFileTypes: isChecked && !prev.allowedFileTypes.includes(fileType) ? [...prev.allowedFileTypes, fileType] : prev.allowedFileTypes.filter((type) => type !== fileType),
    }));
  }

  function handleSwitchChange(setting: "autoSummarizeEnabled" | "smartSearchEnabled", isOn: boolean) {
    setSettings((prev) => ({
      ...prev,
      [setting]: isOn,
    }));
  }

  function handleClearFilesSelectChange(value: string | number) {
    const numericValue = Number(value);
    if ([0, 30, 60, 90].includes(numericValue)) {
      setSettings((prev) => ({
        ...prev,
        clearFilesAfterDays: numericValue as 0 | 30 | 60 | 90,
      }));
    }
  }

  return (
    <div className={styles.settingsFormBox}>
      <div className={styles.settingsTitle}>
        <div className={styles.title}>Allow files</div>
        <div className={styles.allowFilesBox}>
          <CheckBox set={settings.allowedFileTypes.includes("pdf")} onChange={(isChecked) => handleCheckBoxChange("pdf", isChecked)}>
            PDF
          </CheckBox>
          <CheckBox set={settings.allowedFileTypes.includes("image")} onChange={(isChecked) => handleCheckBoxChange("image", isChecked)}>
            Image
          </CheckBox>
          <CheckBox set={settings.allowedFileTypes.includes("audio")} onChange={(isChecked) => handleCheckBoxChange("audio", isChecked)}>
            Audio
          </CheckBox>
        </div>
      </div>
      <div className={styles.settingsTitle}>
        <div className={styles.title}>Auto summarize</div>
        <Switch set={settings.autoSummarizeEnabled} onChange={(isOn) => handleSwitchChange("autoSummarizeEnabled", isOn)} />
      </div>
      <div className={styles.settingsTitle}>
        <div className={styles.title}>Smart search</div>
        <Switch set={settings.smartSearchEnabled} onChange={(isOn) => handleSwitchChange("smartSearchEnabled", isOn)} />
      </div>
      <div className={styles.settingsTitle}>
        <div className={styles.title}>Clear files automatically</div>
        <Select set={settings.clearFilesAfterDays} options={clearFilesOptions} onChange={handleClearFilesSelectChange} />
      </div>
      <div className={styles.buttonBox}>
        <button className={styles.saveButton} onClick={() => onSubmit(settings)} disabled={!isChanged}>
          Save
        </button>
      </div>
    </div>
  );
}
