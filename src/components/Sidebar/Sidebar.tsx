import { useState } from "react";
import styles from "./Sidebar.module.scss";

export interface SidebarItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  additionalProps?: React.HTMLProps<HTMLLIElement>;
}

interface SidebarProps {
  items: SidebarItem[];
  onSelect: (setting: string) => void;
}

export default function Sidebar({ items, onSelect }: SidebarProps) {
  const [selectedItem, setSelectedItem] = useState<string>(items[0].value);

  function handleItemSelect(item: SidebarItem) {
    setSelectedItem(item.value);
    onSelect(item.value);
  }
  return (
    <div className={styles.sidebarBox}>
      <ul className={styles.sidebarListBox}>
        {items.map((item, index) => (
          <li key={index} onClick={() => handleItemSelect(item)} {...item.additionalProps} className={item.value === selectedItem ? styles.selectedSidebarItem : styles.sidebarItem}>
            <div className={styles.sidebarItemLabel}>
            {item.icon && <span className={styles.sidebarIcon}>{item.icon}</span>}
            {item.label}
            </div>
            {item.value === selectedItem && <div className={styles.selectedItemBox} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
