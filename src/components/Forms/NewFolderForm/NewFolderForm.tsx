import { useEffect, useState } from "react";
import { IFolder, IUserSearchResult } from "../../../common/types";
import SearchBar from "../../SearchBar/SearchBar";
import SharedUserItem from "../../SharedUserItem/SharedUserItem";
import RadioButton from "../../RadioButton/RadioButton";
import { FaCircleInfo, FaFolder, FaLock, FaUsers } from "react-icons/fa6";
import styles from "./NewFolderForm.module.scss";
import { useAlert } from "../../../hooks/useAlert";
import SharedUsersList from "../../SharedUserItem/SharedUsersList/SharedUsersList";
import { capitalizeFirstLetter } from "../../../utils/text";

interface NewFolderFormProps {
  folders: IFolder[];
  editFolder?: { folder: IFolder; sharedUsers: IUserSearchResult[]; onUdatedFolder: (folder: IFolder) => void };
  onSubmit: (folder: IFolder) => void;
  onSearchUsers: (query: string) => Promise<IUserSearchResult[]>;
  onCacnel: () => void;
}

export default function NewFolderForm({ folders, editFolder, onSubmit, onSearchUsers, onCacnel }: NewFolderFormProps) {
  const { setAlert, clearModal } = useAlert();
  const [folder, setFolder] = useState<IFolder>(
    editFolder
      ? editFolder.folder
      : {
          name: "",
          userId: "",
          filesId: [],
          sharedWith: [],
          totalSize: 0,
          status: "not-summarized",
          isPrivate: true,
          createdAt: new Date(),
        }
  );
  const [isShared, setIsShared] = useState(!folder.isPrivate);
  const [findUsers, setFindUsers] = useState<IUserSearchResult[] | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<IUserSearchResult[]>(editFolder ? editFolder.sharedUsers.filter((user) => folder.sharedWith.some((id) => id.toString() === user._id)) : []);
  const [findUsersVisable, setFindUsersVisable] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "name") {
      setFolder((prevFolder) => ({
        ...prevFolder,
        name: capitalizeFirstLetter(value),
      }));
    } else if (name === "description") {
      setFolder((prevFolder) => {
        const updatedFolder = { ...prevFolder };
        if (value === "") {
          delete updatedFolder.description;
        } else {
          updatedFolder.description = value;
        }
        return updatedFolder;
      });
    }
  }

  function handleSearchUsers(query: string) {
    setFindUsersVisable(true);
    return onSearchUsers(query);
  }

  function handlePrivacyChange(value: string) {
    const isPrivate = value === "private";
    setFolder((prev) => ({ ...prev, isPrivate }));
    setIsShared(!isPrivate);
  }

  function getRadioButtonContent(value: "private" | "shared") {
    if (value === "private") {
      return (
        <div className={styles.privacyBox}>
          <FaLock className={styles.privateIcon} />
          <div className={styles.privacyTextBox}>
            <div className={styles.privactTitle}>Private</div>
            <div className={styles.privactTitleDark}>This folder is accessible only to you.</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.privacyBox}>
          <FaUsers className={styles.publicIcon} />
          <div className={styles.privacyTextBox}>
            <div className={styles.privactTitle}>Shared</div>
            <div className={styles.privactTitleDark}>Allow others to access this folder.</div>
          </div>
        </div>
      );
    }
  }

  function handleSubmit() {
    const { name, isPrivate, sharedWith } = folder;
    if (name === "") {
      setAlert({ text: "Please enter a folder name." });
    } else if (!isPrivate && sharedWith.length === 0) {
      setAlert({ text: `Please select at least one user to share files with, or choose a private folder instead.` });
    } else if (folders.some((folder) => folder.name === name)) {
      setAlert({ text: `A folder with this name already exists. Please pick a different name.` });
    } else {
      if (editFolder) {
        console.log(folder);
        editFolder.onUdatedFolder(folder);
      } else {
        onSubmit(folder);
      }
      clearModal();
    }
  }

  function handleUserClick(user: IUserSearchResult) {
    const isSharedWith = folder.sharedWith.some((id) => id === user._id);
    let sharedWith: string[];

    if (isSharedWith) {
      sharedWith = folder.sharedWith.filter((id) => id !== user._id);
    } else {
      sharedWith = [...folder.sharedWith, user._id];
    }
    setFolder((prev) => ({ ...prev, sharedWith }));

    setSelectedUsers((prev) => {
      const isSelected = prev.some((selectedUser) => selectedUser.email === user.email);
      if (isSelected) {
        return prev.filter((selectedUser) => selectedUser.email !== user.email);
      } else {
        return [...prev, user];
      }
    });
    setFindUsersVisable(false);
    setClearSearch(true);
  }

  useEffect(() => {
    if (clearSearch) {
      setClearSearch(false);
    }
  }, [clearSearch]);

  const titleIconClassName = editFolder ? (editFolder.folder.isPrivate ? styles.privateTitleIcon : styles.sharedTitleIcon) : styles.titleIcon;

  return (
    <div className={styles.folderFormBox}>
      <div className={styles.title}>
        <FaFolder className={titleIconClassName} />
        {editFolder ? `Edit "${editFolder.folder.name}"` : "New Folder"}
        <button className={styles.infoButton}>
          <FaCircleInfo className={styles.infoIcon} />
          <div className={styles.hoverText}>Folder allows you to group up to 10 files, share it with other users and perform smart search on the files</div>
        </button>
      </div>
      <div className={styles.titleSeperator} />
      <div className={styles.formBox}>
        <div className={styles.inputBox}>
          <div className={styles.inputLabel}>Name</div>
          <input type="text" name="name" value={folder.name} onChange={handleChange} className={styles.textInput} autoComplete="off" />
        </div>
        <div className={styles.inputBox}>
          <div className={styles.inputLabel}>
            Description <span className={styles.inputLabelDark}> (optional)</span>
          </div>
          <input type="text" name="description" value={folder.description || ""} onChange={handleChange} className={styles.textInput} autoComplete="off" />
        </div>
        <div className={editFolder ? styles.disableRadioButtonBox : styles.radioButtonBox}>
          <RadioButton name="private" value="private" content={getRadioButtonContent("private")} checked={folder.isPrivate} onChange={handlePrivacyChange} />
          <RadioButton name="shared" value="shared" content={getRadioButtonContent("shared")} checked={!folder.isPrivate} onChange={handlePrivacyChange} />
        </div>
      </div>

      <div className={`${styles.usersBox} ${isShared ? styles.open : ""}`}>
        <div className={styles.searchBarBox}>
          <SearchBar fetchFunction={handleSearchUsers} setData={setFindUsers} placeholder="Search for users..." clearSearchTerm={clearSearch} disableHoverFocus />
          {findUsers && findUsersVisable && (
            <div className={styles.userResultsBox}>
              {findUsers.length === 0 ? (
                <div className={styles.noUsersText}>{"No users found..."}</div>
              ) : (
                findUsers.map((user, index) => <SharedUserItem mode="list" key={index} user={user} onClick={handleUserClick} selected={selectedUsers.some((u) => u._id === user._id)} />)
              )}
            </div>
          )}
        </div>
        {selectedUsers.length > 0 && (
          <div className={styles.sharedUsersList}>
            <SharedUsersList users={selectedUsers} edit onClick={handleUserClick} />
          </div>
        )}
      </div>
      <div className={styles.buttonBox}>
        <button className={styles.cancelButton} onClick={onCacnel}>
          {editFolder ? "Cancel" : "Close"}
        </button>
        <button className={styles.secondaryButton} onClick={handleSubmit}>
          {editFolder ? "Save changes" : "Create folder"}
        </button>
      </div>
    </div>
  );
}
