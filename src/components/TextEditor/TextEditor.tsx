import ReactQuill from "react-quill-new";
import { Theme } from "../../common/types";
import "react-quill-new/dist/quill.snow.css";
import "./TextEditor.scss";
import styles from "../SummaryDisplay/SummaryToolbar/SummaryToolbar.module.scss";
import { useRef, useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface TextEditorProps {
  text: string;
  theme: Theme;
  edit: boolean;
  toggleMode: boolean;
  alignRight: boolean;
  onChange: (htmlText: string) => void;
}

export default function TextEditor({ text, edit, theme, toggleMode, alignRight, onChange }: TextEditorProps) {
  const quillRef = useRef<ReactQuill | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const toolbarOptions = [[{ size: [] }], ["bold", "italic", "underline"], [{ color: [] }, { background: [] }], [{ align: [] }]];

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.value = "";
  }, [toggleMode]);

  function textContents() {
    if (!quillRef.current) return "";
    const quill = quillRef.current.getEditor();
    return quill.getContents().ops.reduce((text, op) => {
      if (typeof op.insert === "string") {
        return text + op.insert;
      } else {
        return text + "\n";
      }
    }, "");
  }

  function getAllMatches(text: string, term: string) {
    const matches = [];
    let index = text.indexOf(term);

    while (index !== -1) {
      matches.push({ index, length: term.length });
      index = text.indexOf(term, index + term.length);
    }

    return matches;
  }

  const setAlignment = () => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    quill.formatLine(0, quill.getLength(), { align: alignRight ? "right" : "left" });
  };

  const handleEditorChange = (htmlText: string) => {
    onChange(htmlText);
    setAlignment();
  };

  useEffect(() => {
    const highlightMatches = () => {
      if (!quillRef.current) return;
      if (!searchQuery) return;
      const quill = quillRef.current.getEditor();
      const term = searchQuery.toLowerCase();
      const contents = textContents().toLowerCase();
      const matches = getAllMatches(contents, term);

      quill.removeFormat(0, quill.getLength());

      matches.forEach(({ index, length }) => {
        quill.formatText(index, length, { background: "#46b1e1" });
      });

      if (matches.length > 0) {
        quill.scrollSelectionIntoView();
      }
    };
    highlightMatches();
  }, [searchQuery]);

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearchQuery(query.length < 3 ? "" : query);
  }

  return (
    <div className={styles.textEditorBox}>
      <div className={styles.searchBarBox}>
        <input type="text" placeholder="Search..." onChange={handleSearchInputChange} className={theme === "dark" ? styles.searchInput : styles.searchInputLight} ref={searchInputRef} />
        <FaMagnifyingGlass className={theme === "dark" ? styles.searchIcon : styles.searchIconLight} />
      </div>
      <ReactQuill ref={quillRef} readOnly={!edit} modules={{ toolbar: toolbarOptions }} value={text} onChange={handleEditorChange} className={`${theme} ${edit ? "edit" : ""}`} />
    </div>
  );
}
