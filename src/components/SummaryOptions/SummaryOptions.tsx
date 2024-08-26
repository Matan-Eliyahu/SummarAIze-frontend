import { useState } from "react";
import { IFile, ISummaryOptions, summaryLanguageOptions, summaryToneOptions } from "../../common/types";
import Select from "../Select/Select";
import Slider from "../Slider/Slider";
import styles from "./SummaryOptions.module.scss";
import { FaSliders, FaXmark } from "react-icons/fa6";

interface SummaryOptionsProps {
  initSummaryOptions: ISummaryOptions;
  file: IFile;
  onSummarize: (summaryOptions: ISummaryOptions) => Promise<void>;
  disabled: boolean;
}

export default function SummaryOptions({ initSummaryOptions, file, onSummarize, disabled }: SummaryOptionsProps) {
  const [summaryOptions, setSummaryOptions] = useState<ISummaryOptions>(initSummaryOptions);

  function handleSummaryOptionChange(key: keyof ISummaryOptions, value: string | number) {
    setSummaryOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleKeywordClick(keyword: string) {
    setSummaryOptions((prevOptions) => {
      const newKeywords = prevOptions.keywords.includes(keyword) ? prevOptions.keywords.filter((k) => k !== keyword) : [...prevOptions.keywords, keyword];

      return {
        ...prevOptions,
        keywords: newKeywords,
      };
    });
  }

  return (
    <div className={styles.optionsBox}>
      <div className={styles.summaryOptionsTitle}>
        <FaSliders className={styles.summaryOptionsIcon} />
        Summary Options
      </div>
      <div className={disabled ? styles.disabledOptionsContainer : styles.optionsContainer}>
        <div className={styles.titleOptionsBox}>
          <div className={styles.titleBox}>Language</div>
          <div className={styles.sliderBox}>
            <Select options={summaryLanguageOptions} set={summaryOptions.language} onChange={(newLanguage) => handleSummaryOptionChange("language", newLanguage)} />
          </div>
        </div>
        <div className={styles.titleOptionsBox}>
          <div className={styles.titleBox}>Length</div>
          <div className={styles.sliderBox}>
            <Slider options={["short", "medium", "long"]} initialValue={summaryOptions.length} onChange={(newLength) => handleSummaryOptionChange("length", newLength)} />
          </div>
        </div>
        <div className={styles.titleOptionsBox}>
          <div className={styles.titleBox}>Tone</div>
          <div className={styles.sliderBox}>
            <Select options={summaryToneOptions} set={summaryOptions.tone} onChange={(newTone) => handleSummaryOptionChange("tone", newTone)} />
          </div>
        </div>
        <div className={styles.titleOptionsBox}>
          <div className={styles.titleBox}>Details Level</div>
          <div className={styles.sliderBox}>
            <Slider options={["low", "medium", "high"]} initialValue={summaryOptions.detailLevel} onChange={(newDetailLevel) => handleSummaryOptionChange("detailLevel", newDetailLevel)} />
          </div>
        </div>

        <div className={styles.keywordsBox}>
          {file.keywords.map((keyword, index) => (
            <div className={`${styles.keywordTag} ${summaryOptions.keywords.includes(keyword) ? styles.selected : ""}`} key={index} onClick={() => handleKeywordClick(keyword)}>
              {summaryOptions.keywords.includes(keyword) && <FaXmark className={styles.keywordCloseIcon} />}
              {keyword}
            </div>
          ))}
        </div>
      <button className={styles.summarizeButton} onClick={() => onSummarize(summaryOptions)} disabled={disabled}>
        Summarize
      </button>
      </div>
    </div>
  );
}
