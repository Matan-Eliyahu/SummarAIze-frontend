import { FaClock } from "react-icons/fa6";
import { IFile } from "../../common/types";
import styles from "./RecentFilesList.module.scss";
import FileItem from "../DragDrop/FileItem/FileItem";

interface RecentFilesListProps {
  files: IFile[];
  recentFileNames: string[];
}

export default function RecentFilesList({ files, recentFileNames }: RecentFilesListProps) {
  const recentFiles: IFile[] = files.filter((file) => recentFileNames.includes(file.name));
  return (
    <div className={styles.recentFilesBox}>
      <div className={styles.title}>
        <FaClock className={styles.titleIcon} />
        Recent files
      </div>
      <div className={styles.filesBox}>
        {recentFiles.length === 0 ? <div className={styles.noFilesText}>No Recent files</div> : recentFiles.map((file, index) => <FileItem key={index} file={file} listView="icons" />)}
      </div>
    </div>
  );
}
