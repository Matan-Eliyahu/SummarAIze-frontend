import { useEffect, useState } from "react";
import styles from "./SummaryToolbar.module.scss";
import { FaFileLines, FaMinus, FaPenToSquare, FaPlus } from "react-icons/fa6";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export type ModeType = "transcribe" | "summary";

interface SummaryToolbarProps {
  onModeChange: (mode: ModeType) => void;
  onEditToggle: () => void;
  onThemeToggle: (theme: "light" | "dark") => void;
  onCancelEdit: () => void;
  onFontSizeChange: (textSize: number) => void;
  isSummarized: boolean;
  isEditing: boolean;
  loading: boolean;
}

export default function SummaryToolbar({ onModeChange, onEditToggle, onCancelEdit, onFontSizeChange, onThemeToggle, isEditing, isSummarized, loading }: SummaryToolbarProps) {
  const [mode, setMode] = useState<ModeType>("summary");
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  function handleModeChange() {
    const newMode: ModeType = mode === "transcribe" ? "summary" : "transcribe";
    setMode(newMode);
    onModeChange(newMode);
  }

  useEffect(() => {
    onFontSizeChange(fontSize);
  }, [fontSize, onFontSizeChange]);

  useEffect(() => {
    onThemeToggle(theme);
  }, [theme, onThemeToggle]);

  function handleIncreaseFontSize() {
    setFontSize((prev) => (prev === 32 ? prev : prev + 2));
  }

  function handleDecreaseFontSize() {
    setFontSize((prev) => (prev === 14 ? prev : prev - 2));
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className={styles.summaryToolbarBox}>
      <div className={styles.fontSizeBox}>
        <button className={styles.fontSizeButton} onClick={handleDecreaseFontSize}>
          <FaMinus />
        </button>
        <div className={styles.seperator} />
        <div className={styles.fontSizeText}>{fontSize}</div>
        <div className={styles.seperator} />
        <button className={styles.fontSizeButton} onClick={handleIncreaseFontSize}>
          <FaPlus />
        </button>
      </div>
      <div className={styles.editButtonBox}>
        {isEditing && (
          <button className={styles.cancelButton} onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button className={styles.themeButton} onClick={toggleTheme}>
          {theme === "dark" ? <MdOutlineLightMode className={styles.themeIcon} /> : <MdOutlineDarkMode className={styles.themeIcon} />}
        </button>
        {(mode === "summary" && !isSummarized) || loading ? null : (
          <button className={isEditing ? styles.saveButton : styles.editButton} onClick={onEditToggle}>
            {isEditing ? (
              "Save"
            ) : (
              <>
                <FaPenToSquare />
                Edit
              </>
            )}
          </button>
        )}
      </div>
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
