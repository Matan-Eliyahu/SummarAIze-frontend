import { useState, useEffect } from "react";
import styles from "./SummaryDisplay.module.scss";
import SummaryToolbar, { ModeType } from "./SummaryToolbar/SummaryToolbar";
import Spinner from "../Spinner/Spinner";

interface SummaryDisplayProps {
  transcribe: string;
  summary: string;
  onSave: (updatedTranscribe: string, updatedSummary: string) => void;
  loading: boolean;
}

function SummaryDisplay({ transcribe, summary, onSave, loading }: SummaryDisplayProps) {
  const [edit, setEdit] = useState(false);
  const [mode, setMode] = useState<ModeType>("summary");
  const [updatedTranscribe, setUpdatedTranscribe] = useState(transcribe);
  const [updatedSummary, setUpdatedSummary] = useState(summary);
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    const textToCheck = mode === "transcribe" ? updatedTranscribe : updatedSummary;
    setIsRtl(isHebrew(textToCheck));
  }, [mode, updatedTranscribe, updatedSummary]);

  function handleModeChange(newMode: ModeType) {
    setMode(newMode);
  }

  function toggleEdit() {
    setEdit((prev) => !prev);
    if (edit) {
      onSave(updatedTranscribe, updatedSummary);
    }
  }

  function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newText = event.target.value;
    if (mode === "summary") {
      setUpdatedSummary(newText);
    } else {
      setUpdatedTranscribe(newText);
    }
  }

  return (
    <div className={styles.summaryDisplayBox}>
      <SummaryToolbar onModeChange={handleModeChange} onEditToggle={toggleEdit} isEditing={edit} />
      {edit ? (
        <textarea className={`${styles.textAreaBox} ${isRtl ? styles.rtl : ""}`} value={mode === "transcribe" ? updatedTranscribe : updatedSummary} onChange={handleTextAreaChange} />
      ) : loading ? (
        <div className={styles.loadingBox}>
          <Spinner size="m" />
        </div>
      ) : (
        <div className={`${styles.textBox} ${isRtl ? styles.rtl : ""}`}>{mode === "transcribe" ? updatedTranscribe : updatedSummary}</div>
      )}
    </div>
  );
}

function isHebrew(text: string): boolean {
  const hebrewPattern = /[\u0590-\u05FF]/;
  return hebrewPattern.test(text);
}

export default SummaryDisplay;
