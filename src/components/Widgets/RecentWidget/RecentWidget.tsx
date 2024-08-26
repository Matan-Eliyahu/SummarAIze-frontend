import { FaClock } from "react-icons/fa6";
import FileItem from "../../SmartFolder/FileItem/FileItem";
import { IFileInfo } from "../../../common/types";
import styles from "./RecentWidget.module.scss";
import Widget from "../Widget";

interface RecentWidgetProps {
  files: IFileInfo[];
  recentFileNames: string[];
  loading?: boolean;
}

export default function RecentWidget({ files, recentFileNames, loading }: RecentWidgetProps) {
  const recentFiles: IFileInfo[] = files.filter((file) => recentFileNames.includes(file.name));

  return (
    <Widget title="Recent" icon={FaClock} loading={loading}>
      {recentFiles.length === 0 ? (
        <div className={styles.noFilesText}>No Recent files</div>
      ) : (
        recentFiles.map((file, index) => <FileItem key={index} file={file} listView="recent" isSelected={false} onClick={()=>{}} onLongPress={() => {}} onSelectToggle={() => {}} isSelectionMode={false} />)
      )}
    </Widget>
  );
}
