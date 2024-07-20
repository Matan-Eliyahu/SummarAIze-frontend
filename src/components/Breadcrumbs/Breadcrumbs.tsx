import { Link, useLocation } from "react-router-dom";
import { FaCaretRight, FaHouse } from "react-icons/fa6";
import styles from "./Breadcrumbs.module.scss";
import { capitalizeFirstLetter } from "../../utils/text";
import { ReactElement } from "react";
import Spinner from "../Spinner/Spinner";

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
        const displayText = capitalizeFirstLetter(path);

        return (
          <Link key={index} to={to}>
            <div className={`${styles.breadcrumbItem} ${styles.fadeIn}`}>
              <div className={styles.iconBox}>
              {loading && index == paths.length - 1 ? <Spinner size="xs" /> : getPathIcon(index)}
              </div>
              {displayText}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
