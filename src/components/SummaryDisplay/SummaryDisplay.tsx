import { useState } from "react";
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
        <textarea className={styles.textAreaBox} value={mode === "transcribe" ? updatedTranscribe : updatedSummary} onChange={handleTextAreaChange} />
      ) : loading ? (
        <div className={styles.loadingBox}>
          <Spinner size="m" />
        </div>
      ) : (
        <div className={styles.textBox}>{mode === "transcribe" ? updatedTranscribe : updatedSummary}</div>
      )}
    </div>
  );
}

export default SummaryDisplay;
