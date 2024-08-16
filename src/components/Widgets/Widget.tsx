import { ReactNode } from "react";
import styles from "./Widget.module.scss";
import { IconType } from "react-icons";
import Spinner from "../Spinner/Spinner";

interface WidgetProps {
  title: string;
  icon: IconType;
  children: ReactNode;
  loading?:boolean;
  badge?: { value: string; label: string };
}

export default function Widget({ title, icon: Icon, children,loading, badge }: WidgetProps) {
  return (
    <div className={styles.widgetBox}>
      <div className={styles.title}>
        <Icon className={styles.titleIcon} />
        {title}
        {badge && (
          <div className={styles.badgeBox}>
            <span className={styles.badgeLabel}>{badge.value}</span>
            {` ${badge.label}`}
          </div>
        )}
      </div>
      <div className={styles.contentBox}>
        {loading ? (
          <div className={styles.spinnerBox}>
            <Spinner size="m" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
