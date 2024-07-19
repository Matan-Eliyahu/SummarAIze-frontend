import { Link, useLocation } from "react-router-dom";
import { FaCaretRight, FaHouse } from "react-icons/fa6";
import styles from "./Breadcrumbs.module.scss";
import { capitalizeFirstLetter } from "../../utils/text";

export default function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path);

  return (
    <div className={styles.breadcrumbsBox}>
      {paths.map((path, index) => {
        const to = `/${paths.slice(0, index + 1).join("/")}`;
        const displayText = capitalizeFirstLetter(path);

        return (
          <Link key={index} to={to}>
            <div className={`${styles.breadcrumbItem} ${styles.fadeIn}`}>
              {index === 0 ? <FaHouse className={styles.homeIcon} /> : <FaCaretRight className={styles.arrowIcon} />}
              {displayText}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
