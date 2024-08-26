import { FaBell, FaCircle, FaCircleCheck, FaTriangleExclamation } from "react-icons/fa6";
import { FileStatus } from "../../../common/types";
import Spinner from "../../Spinner/Spinner";
import styles from "./FileItem.module.scss";

export function statusIconSwitch(status: FileStatus, isSelectionMode?: boolean, isSelected?: boolean) {
  if (isSelectionMode) {
    return isSelected ? <FaCircleCheck className={styles.selectIcon} /> : <FaCircle className={styles.nonSelectIcon} />;
  } else {
    switch (status) {
      case "processing":
        return <Spinner size="s" />;
      case "completed":
        return <div className={styles.summarizedIcon} />;
      case "not-summarized":
        return <FaBell className={styles.unprocessedIcon} />;
      case "error":
        return <FaTriangleExclamation className={styles.errorIcon} />;
    }
  }
}
