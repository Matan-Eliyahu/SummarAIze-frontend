import { useState } from "react";
import styles from "./SummaryToolbar.module.scss";
import { FaFileLines } from "react-icons/fa6";
import { DiVim } from "react-icons/di";

export type ModeType = "transcribe" | "summary";

interface SummaryToolbarProps {
  onModeChange: (mode: ModeType) => void;
  onEditToggle: () => void;
  onCancelEdit: () => void;
  isEditing: boolean;
  isSummarized:boolean;
}

export default function SummaryToolbar({ onModeChange, onEditToggle, onCancelEdit, isEditing, isSummarized }: SummaryToolbarProps) {
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
      <div className={styles.editButtonBox}>
        {isEditing && (
          <button className={styles.cancelButton} onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button className={isEditing ? styles.saveButton : styles.editButton} onClick={onEditToggle}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      <div className={styles.summaryButtonBox}>
       {isSummarized ?<> <button className={mode === "summary" ? styles.summaryButtonSelected : styles.summaryButton} onClick={handleModeChange}>
          <div className={styles.summarizedIcon} />
          Summary
        </button>
        <div className={styles.seperator} />
        <button className={mode === "transcribe" ? styles.summaryButtonSelected : styles.summaryButton} onClick={handleModeChange}>
          <FaFileLines className={styles.transcribeButtonIcon} />
          Transcribe
        </button></> : <div className={styles.noSummarizedText}>Not summarAIzed</div>}
      </div>
    </div>
  );
}
