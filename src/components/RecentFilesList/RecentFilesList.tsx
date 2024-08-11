import { FaClock } from "react-icons/fa6";
import { IFileInfo } from "../../common/types";
import styles from "./RecentFilesList.module.scss";
import FileItem from "../DragDrop/FileItem/FileItem";
import Spinner from "../Spinner/Spinner";

interface RecentFilesListProps {
  files: IFileInfo[];
  recentFileNames: string[];
  loading: boolean;
}

export default function RecentFilesList({ files, recentFileNames, loading }: RecentFilesListProps) {
  const recentFiles: IFileInfo[] = files.filter((file) => recentFileNames.includes(file.name));

  return (
    <div className={styles.recentFilesBox}>
      <div className={styles.title}>
        <FaClock className={styles.titleIcon} />
        Recent files
      </div>
      <div className={styles.contentBox}>
        {loading ? (
          <Spinner size="s" />
        ) : recentFiles.length === 0 ? (
          <div className={styles.noFilesText}>No Recent files</div>
        ) : (
          recentFiles.map((file, index) => <FileItem key={index} file={file} listView="recent" isSelected={false} onLongPress={() => {}} onSelectToggle={() => {}} isSelectionMode={false} />)
        )}
      </div>
    </div>
  );
}
