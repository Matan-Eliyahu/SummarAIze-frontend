import { useState } from "react";
import { IFolder, IUserSearchResult } from "../../../common/types";
import SearchBar from "../../SearchBar/SearchBar";
import SharedUserItem from "../../SharedUserItem/SharedUserItem";
import RadioButton from "../../RadioButton/RadioButton";
import { FaFolder, FaLock, FaUser, FaUsers } from "react-icons/fa6";
import styles from "./NewFolderForm.module.scss";

interface NewFolderFormProps {
  onSubmit: (folder: IFolder) => void;
  onSearchUsers: (query: string) => Promise<IUserSearchResult[]>;
  onCacnel: () => void;
}

export default function NewFolderForm({ onSubmit, onSearchUsers, onCacnel }: NewFolderFormProps) {
  const [folder, setFolder] = useState<IFolder>({
    name: "",
    userId: "",
    filesId: [],
    sharedWith: [],
    totalSize: 0,
    status: "not-summarized",
    isPrivate: true,
    createdAt: new Date(),
  });
  const [isShared, setIsShared] = useState(false);
  const [findUsers, setFindUsers] = useState<IUserSearchResult[] | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<IUserSearchResult[]>([]);
  const [findUsersVisable, setFindUsersVisable] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "name") {
      setFolder((prevFolder) => ({
        ...prevFolder,
        name: value,
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
          <FaLock className={styles.privacyIcon} />
          <div className={styles.privacyTextBox}>
            <div className={styles.privactTitle}>Private</div>
            <div className={styles.privactTitleDark}>This folder is accessible only to you.</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.privacyBox}>
          <FaUsers className={styles.privacyIcon} />
          <div className={styles.privacyTextBox}>
            <div className={styles.privactTitle}>Shared</div>
            <div className={styles.privactTitleDark}>Allow others to access this folder.</div>
          </div>
        </div>
      );
    }
  }

  function handleSubmit() {
    onSubmit(folder);
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
  }

  return (
    <div className={styles.folderFormBox}>
      <div className={styles.title}>
        <FaFolder className={styles.titleIcon} />
        New Folder
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
          <input type="text" name="description" value={folder.description} onChange={handleChange} className={styles.textInput} autoComplete="off"/>
        </div>
        <RadioButton name="private" value="private" content={getRadioButtonContent("private")} checked={folder.isPrivate} onChange={handlePrivacyChange} />
        <RadioButton name="shared" value="shared" content={getRadioButtonContent("shared")} checked={!folder.isPrivate} onChange={handlePrivacyChange} />
      </div>
      {/* {selectedUsers.length > 0 && (
        <div className={styles.selectedUsersContainer}>
          <div className={styles.selectedUsersLabel}>
            <FaUser className={styles.selectedUsersLabelIcon} />
            Share with
          </div>
          <div className={styles.selectedUsersBox}>
            {selectedUsers.map((user, index) => (
              <SharedUserItem key={index} user={user} onClick={handleUserClick} selected />
            ))}
          </div>
        </div>
      )} */}
      {
        <div className={`${styles.usersBox} ${isShared ? styles.open : ""}`}>
          <div className={styles.selectedUsersLabel}>
            <FaUser className={styles.selectedUsersLabelIcon} />
            Share with
          </div>
          <div className={styles.selectedUsersBox}>
            {selectedUsers.map((user, index) => (
              <SharedUserItem key={index} user={user} onClick={handleUserClick} selected />
            ))}
          </div>
          <div className={styles.searchBarBox}>
            <SearchBar fetchFunction={handleSearchUsers} setData={setFindUsers} placeholder="Search for users..." disableHoverFocus />
          </div>
          {findUsers && findUsersVisable && (
            <div className={styles.usersListBox}>
              {findUsers.length === 0 ? "No users found..." : findUsers.map((user, index) => <SharedUserItem key={index} user={user} onClick={handleUserClick} />)}
            </div>
          )}
        </div>
      }
      <div className={styles.buttonBox}>
        <button className={styles.cancelButton} onClick={onCacnel}>
          Cancel
        </button>
        <button className={styles.secondaryButton} onClick={handleSubmit}>
          Create folder
        </button>
      </div>
    </div>
  );
}
