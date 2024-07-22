import { Link, useLocation } from "react-router-dom";
import { FaCaretRight, FaHouse } from "react-icons/fa6";
import styles from "./Breadcrumbs.module.scss";
import { capitalizeFirstLetter, isFileName } from "../../utils/text";
import { ReactElement } from "react";
import Spinner from "../Spinner/Spinner";
import { getFileTypeByName } from "../../utils/files";
import { fileIconMap } from "../../common/icons";

interface BreadcrumbsProps {
  loading: boolean;
}

export default function Breadcrumbs({ loading }: BreadcrumbsProps) {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path);

  function getPathIcon(index: number): ReactElement {
    return index === 0 ? <FaHouse className={styles.homeIcon} /> : <FaCaretRight className={styles.arrowIcon} />;
  }

  return (
    <div className={styles.breadcrumbsBox}>
      {paths.map((path, index) => {
        const to = `/${paths.slice(0, index + 1).join("/")}`;
        const displayText = capitalizeFirstLetter(path).replace(/%20/g, " ");
        const isFilePath = isFileName(path);

        return (
          <Link key={index} to={to}>
            <div className={`${isFilePath ? styles.breadcrumbFileItem : styles.breadcrumbItem} ${styles.fadeIn}`}>
              <div className={styles.iconBox}>{loading && index == paths.length - 1 ? <Spinner size="xs" /> : getPathIcon(index)}</div>
              {isFilePath && getFileTypeByName(path)!==null && <img src={fileIconMap[getFileTypeByName(path)!]} style={{width:15}}/>}
              {displayText}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
