import { useState, useEffect } from "react";
import styles from "./SummaryDisplay.module.scss";
import SummaryToolbar, { ModeType } from "./SummaryToolbar/SummaryToolbar";
import Spinner from "../Spinner/Spinner";
import { isHebrew } from "../../utils/text";

interface SummaryDisplayProps {
  transcribe: string;
  summary: string;
  onSave: (updatedTranscribe: string, updatedSummary: string) => void;
  loading: boolean;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

function SummaryDisplay({ transcribe, summary, onSave, loading, edit, setEdit }: SummaryDisplayProps) {
  const [mode, setMode] = useState<ModeType>("summary");
  const [updatedTranscribe, setUpdatedTranscribe] = useState(transcribe);
  const [updatedSummary, setUpdatedSummary] = useState(summary);
  const [isRtl, setIsRtl] = useState(false);
  const isSummarized = transcribe !== "" && summary !== "";

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

  function handleCancelEdit() {
    setEdit((prev) => !prev);
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
      <SummaryToolbar onModeChange={handleModeChange} onEditToggle={toggleEdit} onCancelEdit={handleCancelEdit} isEditing={edit} isSummarized={isSummarized} />
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

export default SummaryDisplay;
