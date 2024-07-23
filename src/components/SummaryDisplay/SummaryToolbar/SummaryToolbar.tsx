import { useState } from "react";
import styles from "./SummaryToolbar.module.scss";
import { FaFileLines } from "react-icons/fa6";

export type ModeType = "transcribe" | "summary";

interface SummaryToolbarProps {
  onModeChange: (mode: ModeType) => void;
  onEditToggle: () => void;
  isEditing: boolean;
}

export default function SummaryToolbar({ onModeChange, onEditToggle, isEditing }: SummaryToolbarProps) {
  const [mode, setMode] = useState<ModeType>("summary");

  function handleModeChange() {
    const newMode: ModeType = mode === "transcribe" ? "summary" : "transcribe";
    setMode(newMode);
    onModeChange(newMode);
  }

  return (
    <div className={styles.summaryToolbarBox}>
      {/* <button className={styles.summaryButton} onClick={handleModeChange}>
        {mode === "transcribe" ? "Summary" : "Transcription"}
      </button> */}
      <button className={isEditing ? styles.saveButton : styles.editButton} onClick={onEditToggle}>
        {isEditing ? "Save" : "Edit"}
      </button>
      <div className={styles.summaryButtonBox}>
        <button className={mode === "summary" ? styles.summaryButtonSelected : styles.summaryButton} onClick={handleModeChange}>
          <div className={styles.summarizedIcon} />
          Summary
        </button>
        <div className={styles.seperator} />
        <button className={mode === "transcribe" ? styles.summaryButtonSelected : styles.summaryButton} onClick={handleModeChange}>
          <FaFileLines className={styles.transcribeButtonIcon} />
          Transcribe
        </button>
      </div>
    </div>
  );
}
