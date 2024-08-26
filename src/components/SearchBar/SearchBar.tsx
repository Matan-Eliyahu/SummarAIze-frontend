import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp, FaMagnifyingGlass } from "react-icons/fa6";
import styles from "./SearchBar.module.scss";
import Spinner from "../Spinner/Spinner";
import StarsIcon from "./StarsIcon/StarsIcon";

interface SearchBarProps<T> {
  fetchFunction: (searchTerm: string) => Promise<T[]>;
  setData: React.Dispatch<React.SetStateAction<T[] | null>>;
  placeholder: string;
  disableHoverFocus?: boolean;
  clearSearchTerm?: boolean;
  smartSearch?: boolean;
  smartSearchFetchFunction?: (searchTerm: string) => Promise<T[]>;
  disabled?: boolean;
}

function SearchBar<T>({ fetchFunction, setData, placeholder, disableHoverFocus, clearSearchTerm, smartSearch, disabled, smartSearchFetchFunction }: SearchBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingSmartSearch, setLoadingSmartSeach] = useState(false);
  const [isSmartSearchOn, setIsSmartSearchOn] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSearch(term: string) {
    if (isSmartSearchOn) return;
    if (term === "") {
      setData(null);
      return;
    }
    if (term.length > 2) {
      setLoading(true);
      const data = await fetchFunction(term);
      setData(data);
      setLoading(false);
    }
  }

  function handleSmartSearchIsOn(isOn: boolean) {
    setIsSmartSearchOn(isOn);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const term = event.target.value;
    setSearchTerm(term);
    handleSearch(term);
  }

  async function handleSmartSearch() {
    if (searchTerm && smartSearchFetchFunction) {
      setLoadingSmartSeach(true);
      const data = await smartSearchFetchFunction(searchTerm);
      setData(data);
      setLoadingSmartSeach(false);
      setSearchTerm("");
    }
  }

  useEffect(() => {
    if (clearSearchTerm) {
      setSearchTerm("");
      setData(null);
    }
  }, [clearSearchTerm]);

  return (
    <div className={disabled ? styles.searchBarBoxDisabled : styles.searchBarBox}>
      <input
        ref={searchInputRef}
        className={`${styles.searchBarInput} ${disableHoverFocus ? styles.noHoverFocus : ""}`}
        type="text"
        placeholder={smartSearch && isSmartSearchOn ? "Enter a query to search with AI..." : placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        style={{ paddingLeft: smartSearch ? "36px" : "12px" }}
      />
      {smartSearch && (
        <div className={styles.smartSearchBox}>
          <StarsIcon size={20} onToggleIsOn={handleSmartSearchIsOn} />
        </div>
      )}
      {loading || loadingSmartSearch ? (
        <div className={styles.spinnerBox}>
          <Spinner size="s" />
        </div>
      ) : smartSearch && isSmartSearchOn ? (
        <button className={styles.smartSearchButton} onClick={handleSmartSearch}>
          <FaArrowUp className={styles.smartSearchIcon} />
        </button>
      ) : (
        <FaMagnifyingGlass className={styles.searchIcon} />
      )}
    </div>
  );
}

export default SearchBar;
