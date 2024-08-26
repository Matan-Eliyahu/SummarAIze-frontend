import { useLocation, useNavigate } from "react-router-dom";
import { FaCaretRight, FaFolder, FaHouse } from "react-icons/fa6";
import styles from "./Breadcrumbs.module.scss";
import { capitalizeFirstLetter } from "../../utils/text";
import { ReactElement } from "react";
import Spinner from "../Spinner/Spinner";
import { getFileTypeByName } from "../../utils/files";
import { fileIconMap } from "../../common/icons";
import { IFile, IFolder } from "../../common/types";
import { useStore } from "../../hooks/useStore";

export type BreadcrumbsOptions = { file: IFile | null; folder: IFolder | null };

interface BreadcrumbsProps {
  options?: BreadcrumbsOptions;
  loading: boolean;
}

export default function Breadcrumbs({ options, loading }: BreadcrumbsProps) {
  const { setCurrentFolder } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path);
  const isFolder = options !== undefined && options.folder !== null;
  const isFile = options !== undefined && options.file !== null;

  function getPathIcon(index: number): ReactElement {
    return index === 0 ? <FaHouse className={styles.homeIcon} /> : <FaCaretRight className={styles.arrowIcon} />;
  }

  const enhancedPaths = [...paths];

  if (options?.folder) {
    enhancedPaths[1] = options.folder.name;
  }

  if (options?.file) {
    if (options.folder) {
      enhancedPaths.splice(2, 1, options.file.name);
    } else {
      enhancedPaths[1] = options.file.name;
    }
  }

  function handlePathClick(path: string) {
    if (path === "dashboard") {
      if (isFolder) {
        setCurrentFolder(null);
      }
      navigate("/dashboard");
    } else if (isFolder && path === options.folder!.name) {
      navigate("/dashboard");
    }
  }

  return (
    <div className={styles.breadcrumbsBox}>
      {enhancedPaths.map((path, index) => {
        const displayText = isFile ? path : capitalizeFirstLetter(path).replace(/%20/g, " ");
        const isFilePath = isFile && options.file!.name === path;
        const isFolderPath = isFolder && path === options.folder!.name;
        const isFolderPrivate = isFolder && options.folder!.isPrivate;

        return (
          <div key={index} className={`${isFilePath ? styles.breadcrumbFileItem : styles.breadcrumbItem} ${styles.fadeIn}`} onClick={() => handlePathClick(path)}>
            <div className={styles.iconBox}>{loading && index === enhancedPaths.length - 1 ? <Spinner size="xs" /> : getPathIcon(index)}</div>
            {isFolderPath && (
              <div className={styles.iconBox}>
                <FaFolder className={isFolderPrivate ? styles.privateFolderIcon : styles.sharedFolderIcon} />
              </div>
            )}
            {isFilePath && getFileTypeByName(path) !== null && (
              <div className={styles.iconBox}>
                <img src={fileIconMap[getFileTypeByName(path)!]} style={{ width: 15 }} />
              </div>
            )}
            {displayText}
          </div>
        );
      })}
    </div>
  );
}
