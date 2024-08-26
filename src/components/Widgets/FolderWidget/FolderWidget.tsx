import moment from "moment";
import { IFolder, IUserSearchResult } from "../../../common/types";
import styles from "./FolderWidget.module.scss";
import Widget from "../Widget";
import { FaBoxOpen, FaFolder, FaPenToSquare } from "react-icons/fa6";
import { statusIconSwitch } from "../../SmartFolder/FileItem/iconUtils";
import ProgressBar from "../../ProgressBar/ProgressBar";
import { capitalizeFirstLetter } from "../../../utils/text";
import SharedUsersList from "../../SharedUserItem/SharedUsersList/SharedUsersList";

interface FolderWidgetProps {
  folder: IFolder;
  totalStorage: number;
  onEditClick: () => void;
  sharedUsers?: IUserSearchResult[];
  isMyFolder: boolean;
  loading?: boolean;
}

export function FolderWidget({ folder, totalStorage, sharedUsers, isMyFolder, loading, onEditClick }: FolderWidgetProps) {
  const { name, description, filesId, isPrivate, totalSize, sharedWith, createdAt } = folder;
  const totalSizeProgress = (totalSize / totalStorage) * 100;
  const isShared = sharedWith.length > 0;
  const numOfFiles = filesId.length;
  const numOfUsers = sharedWith.length;
  const badge = isShared ? { value: numOfUsers.toString(), label: "Users" } : undefined;
  const statusText = capitalizeFirstLetter(folder.status.replace("-", " "));
  const isEmpty = folder.filesId.length === 0;
  const sharedUsersList = sharedUsers?.filter((user) => folder.sharedWith.some((id) => user._id === id.toString()) || folder.userId == user._id) || [];

  return (
    <Widget title={name} icon={FaFolder} badge={badge} loading={loading} iconTheme={isPrivate ? "create" : "primary"}>
      <div className={styles.infoBox}>
        <div className={styles.infoIconBox}>
          <div className={styles.statusIconBox}>{statusIconSwitch(folder.status)}</div>
          {statusText}
        </div>
        <div className={styles.infoTextBox}>
          <div className={styles.descriptionBox}>
            Description
            <span className={styles.descriptionText}>{description || "No description"}</span>
          </div>
        </div>
      </div>
      {isShared && sharedUsers && <SharedUsersList users={sharedUsersList} edit={false} onClick={() => {}} />}
      <div className={styles.sizeBox}>
        {isEmpty ? (
          <div className={styles.emptyFolderBox}>
            <FaBoxOpen className={styles.emptyFolderIcon} />
            Folder is empty
          </div>
        ) : (
          <>
            <div className={styles.sizeLabel}>
              Files
              <div className={styles.sizeInfoLabel}>
                {`${numOfFiles}`}
                <span className={styles.sizeDarkLabel}>/10</span>
              </div>
            </div>
            <div className={styles.progressBarBox}>
              <ProgressBar progress={numOfFiles * 10} theme="secondary" />
            </div>
            <div className={styles.sizeLabel}>
              Total size
              <div className={styles.sizeInfoLabel}>
                {`${totalSize.toFixed(2)} MB`}
                <span className={styles.sizeDarkLabel}>/{totalStorage} MB</span>
              </div>
            </div>
            <div className={styles.progressBarBox}>
              <ProgressBar progress={totalSizeProgress} theme="create" />
            </div>
          </>
        )}
      </div>
      <div className={styles.badgeBox}>
        <div className={styles.createdAtBadge}>
          Created<div className={styles.dateLabel}>{moment(createdAt).format("YYYY/MM/DD")}</div>
        </div>
        {isMyFolder && (
          <button className={styles.editButton} onClick={onEditClick}>
            <FaPenToSquare />
            Edit
          </button>
        )}
      </div>
    </Widget>
  );
}

export default FolderWidget;
