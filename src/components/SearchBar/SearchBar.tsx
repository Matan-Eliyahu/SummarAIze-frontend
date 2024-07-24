import React, { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import styles from "./SearchBar.module.scss";
import Spinner from "../Spinner/Spinner";

interface SearchBarProps<T> {
  fetchFunction: (searchTerm: string) => Promise<T[]>;
  setData: React.Dispatch<React.SetStateAction<T[] | null>>;
  placeholder: string;
}

function SearchBar<T>({ fetchFunction, setData, placeholder }: SearchBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term === "") {
      setData(null);
      return;
    }
    if (term.length > 2) {
      setLoading(true);
      const data = await fetchFunction(term);
      console.log(data);
      setData(data);
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    handleSearch(term);
  };

  return (
    <div className={styles.searchBarBox}>
      <input className={`${styles.searchBarInput} no-hover-focus`} type="text" placeholder={placeholder} value={searchTerm} onChange={handleInputChange} />
      {loading ? (
        <div className={styles.spinnerBox}>
          <Spinner size="s" />
        </div>
      ) : (
        <FaMagnifyingGlass className={styles.searchIcon} />
      )}
    </div>
  );
}

export default SearchBar;
