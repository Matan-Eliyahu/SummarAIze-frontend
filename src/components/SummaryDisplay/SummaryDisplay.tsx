import { useState, useEffect } from "react";
import SummaryToolbar, { ModeType } from "./SummaryToolbar/SummaryToolbar";
import Spinner from "../Spinner/Spinner";
import { isHebrew } from "../../utils/text";
import styles from "./SummaryDisplay.module.scss";
import { Theme } from "../../common/types";
import TextEditor from "../TextEditor/TextEditor";

interface SummaryDisplayProps {
  transcribe: string;
  summary: string;
  onSave: (updatedTranscribe: string, updatedSummary: string) => void;
  loading: boolean;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  defaultTheme: Theme;
}

function SummaryDisplay({ transcribe, summary, onSave, loading, edit, setEdit, defaultTheme }: SummaryDisplayProps) {
  const [mode, setMode] = useState<ModeType>("summary");
  const [updatedTranscribe, setUpdatedTranscribe] = useState(transcribe);
  const [updatedSummary, setUpdatedSummary] = useState(summary);
  const [isRtl, setIsRtl] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [toggleMode, setToggleMode] = useState(false);
  const isSummarized = summary !== "";
  const isTranscribe = transcribe !== "";

  useEffect(() => {
    const textToCheck = mode === "transcribe" ? updatedTranscribe : updatedSummary;
    setIsRtl(isHebrew(textToCheck));
  }, [mode, updatedTranscribe, updatedSummary]);

  useEffect(() => {
    if (toggleMode) setToggleMode(false);
  }, [toggleMode]);

  function handleModeChange(newMode: ModeType) {
    setToggleMode(true);
    setMode(newMode);
  }

  function handleToggleEdit() {
    setToggleMode(true);

    setEdit((prev) => !prev);
    if (edit) {
      onSave(updatedTranscribe, updatedSummary);
    }
  }

  function handleCancelEdit() {
    setEdit((prev) => !prev);
  }

  // function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
  //   const newText = event.target.value;
  //   if (mode === "summary") {
  //     setUpdatedSummary(newText);
  //   } else {
  //     setUpdatedTranscribe(newText);
  //   }
  // }

  function handleTextChange(htmlText: string) {
    if (!edit) return;
    if (mode === "summary") {
      setUpdatedSummary(htmlText);
    } else {
      setUpdatedTranscribe(htmlText);
    }
  }

  function handleFontSizeChange(textSize: number) {
    setFontSize(textSize);
  }

  function handleThemeToggle(theme: Theme) {
    setToggleMode(true);

    setTheme(theme);
  }

  return (
    <div className={styles.summaryDisplayBox}>
      <SummaryToolbar
        loading={loading}
        onModeChange={handleModeChange}
        onEditToggle={handleToggleEdit}
        onThemeToggle={handleThemeToggle}
        onCancelEdit={handleCancelEdit}
        isEditing={edit}
        isSummarized={isSummarized}
        isTranscribe={isTranscribe}
        onFontSizeChange={handleFontSizeChange}
        defaultTheme={defaultTheme}
      />
      {/* {edit ? (
        // <textarea
        //   className={`${theme === "light" ? styles.lightTextAreaBox : styles.textAreaBox} ${isRtl ? styles.rtl : ""}`}
        //   style={{ fontSize }}
        //   value={mode === "transcribe" ? updatedTranscribe : updatedSummary}
        //   onChange={handleTextAreaChange}
        // />
        <div className={styles.textEditorBox} style={{ fontSize }}>
          <TextEditor text={mode === "transcribe" ? updatedTranscribe : updatedSummary} edit={edit} theme={theme} onChange={handleTextChange} />
        </div>
      ) : loading ? (
        <div className={styles.loadingBox}>
          Summarizing...
          <Spinner size="m" />
        </div>
      ) : (
        <div className={`${theme === "light" ? styles.lightTextBox : styles.textBox} ${isRtl ? styles.rtl : ""}`} style={{ fontSize }}>
          {mode === "transcribe" ? (
            updatedTranscribe ? (
              removeHtmlTags(updatedTranscribe)
            ) : (
              <div className={styles.noSummaryBox}>
                <div className={styles.noSummaryText}>Transcribe not generated</div>
              </div>
            )
          ) : isSummarized ? (
            removeHtmlTags(updatedSummary)
          ) : (
            <div className={styles.noSummaryBox}>
              <div className={styles.noSummaryText}>Summary not generated</div>
            </div>
          )}
        </div>
      )} */}
      {loading ? (
        <div className={styles.loadingBox}>
          Loading...
          <Spinner size="m" />
        </div>
      ) : (
        <div className={styles.textEditorBox} style={{ fontSize }}>
          <TextEditor text={mode === "transcribe" ? updatedTranscribe : updatedSummary} edit={edit} theme={theme} toggleMode={toggleMode} alignRight={isRtl} onChange={handleTextChange} />
        </div>
      )}
    </div>
  );
}

export default SummaryDisplay;
