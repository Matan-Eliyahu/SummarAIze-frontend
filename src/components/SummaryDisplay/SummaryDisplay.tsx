import { useState, useEffect } from "react";
import SummaryToolbar, { ModeType } from "./SummaryToolbar/SummaryToolbar";
import Spinner from "../Spinner/Spinner";
import { isHebrew } from "../../utils/text";
import { FaBell } from "react-icons/fa";
import logo from "../../assets/logo.png";
import styles from "./SummaryDisplay.module.scss";

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
  const [fontSize, setFontSize] = useState(16);
  const isSummarized = summary !== "";

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

  function handleFontSizeChange(textSize: number) {
    setFontSize(textSize);
  }

  return (
    <div className={styles.summaryDisplayBox}>
      <SummaryToolbar onModeChange={handleModeChange} onEditToggle={toggleEdit} onCancelEdit={handleCancelEdit} isEditing={edit} isSummarized={isSummarized} onFontSizeChange={handleFontSizeChange} />
      {edit ? (
        <textarea
          className={`${styles.textAreaBox} ${isRtl ? styles.rtl : ""}`}
          style={{ fontSize }}
          value={mode === "transcribe" ? updatedTranscribe : updatedSummary}
          onChange={handleTextAreaChange}
        />
      ) : loading ? (
        <div className={styles.loadingBox}>
          <Spinner size="m" />
        </div>
      ) : (
        <div className={`${styles.textBox} ${isRtl ? styles.rtl : ""}`} style={{ fontSize }}>
          {mode === "transcribe" ? (
            updatedTranscribe
          ) : isSummarized ? (
            updatedSummary
          ) : (
            <div className={styles.noSummaryBox}>
              <div className={styles.noSummaryText}>
                <FaBell className={styles.unprocessedIcon} />
                Summary not generated
              </div>
              <button className={styles.summarizeButton}>
                <img src={logo} alt="logo" style={{ width: 130 }} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SummaryDisplay;
