import { useState, useEffect } from "react";
import SummaryToolbar, { ModeType } from "./SummaryToolbar/SummaryToolbar";
import Spinner from "../Spinner/Spinner";
import { isHebrew } from "../../utils/text";
// import logo from "../../assets/logo.png";
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
  const [theme, setTheme] = useState<"light" | "dark">("dark");
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

  function handleThemeToggle(theme: "light" | "dark") {
    setTheme(theme);
  }

  return (
    <div className={styles.summaryDisplayBox}>
      <SummaryToolbar
        loading={loading}
        onModeChange={handleModeChange}
        onEditToggle={toggleEdit}
        onThemeToggle={handleThemeToggle}
        onCancelEdit={handleCancelEdit}
        isEditing={edit}
        isSummarized={isSummarized}
        onFontSizeChange={handleFontSizeChange}
      />
      {edit ? (
        <textarea
          className={`${styles.textAreaBox} ${isRtl ? styles.rtl : ""}`}
          style={{ fontSize }}
          value={mode === "transcribe" ? updatedTranscribe : updatedSummary}
          onChange={handleTextAreaChange}
        />
      ) : loading ? (
        <div className={styles.loadingBox}>
          Processing...
          <Spinner size="m" />
        </div>
      ) : (
        <div className={`${theme === "light" ? styles.lightTextBox : styles.textBox} ${isRtl ? styles.rtl : ""}`} style={{ fontSize }}>
          {mode === "transcribe" ? (
            updatedTranscribe
          ) : isSummarized ? (
            updatedSummary
          ) : (
            <div className={styles.noSummaryBox}>
              <div className={styles.noSummaryText}>Summary not generated</div>
              {/* <button className={styles.summarizeButton}>
                <img src={logo} alt="logo" style={{ width: 130 }} />
              </button> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SummaryDisplay;
