import { useState } from "react";
import styles from "./Sidebar.module.scss";
import { FaRightFromBracket } from "react-icons/fa6";
import { useAlert } from "../../hooks/useAlert";

export interface SidebarItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  additionalProps?: React.HTMLProps<HTMLLIElement>;
}

interface SidebarProps {
  items: SidebarItem[];
  onSelect: (setting: string) => void;
  isAccountSidebar?: boolean;
  onLogout?: () => Promise<void>;
}

export default function Sidebar({ items, onSelect, isAccountSidebar, onLogout }: SidebarProps) {
  const { setAlert, clearAlert } = useAlert();
  const [selectedItem, setSelectedItem] = useState<string>(items[0].value);

  function handleItemSelect(item: SidebarItem) {
    setSelectedItem(item.value);
    onSelect(item.value);
  }

  function handleLogout() {
    if (!onLogout) return;
    setAlert({
      text: "Are you sure you want to log out?",
      buttonColor: "cancel",
      secondButtonText: "Logout",
      secondButtonColor: "danger",
      onSecondButtonClick: async () => {
        clearAlert();
        await onLogout();
      },
    });
  }

  return (
    <div className={styles.sidebarBox}>
      <ul className={styles.sidebarListBox}>
        {items.map((item, index) => (
          <li key={index} onClick={() => handleItemSelect(item)} {...item.additionalProps} className={item.value === selectedItem ? styles.selectedSidebarItem : styles.sidebarItem}>
            <div className={styles.sidebarItemLabel}>
              {item.icon && <span className={styles.sidebarIcon}>{item.icon}</span>}
              <div className={styles.textContainer}>{item.label}</div>
            </div>
            {item.value === selectedItem && <div className={styles.selectedItemBox} />}
          </li>
        ))}
        {isAccountSidebar && (
          <button className={styles.logoutButton} onClick={handleLogout}>
            <FaRightFromBracket className={styles.logoutIcon} />
            Logout
          </button>
        )}
      </ul>
    </div>
  );
}
