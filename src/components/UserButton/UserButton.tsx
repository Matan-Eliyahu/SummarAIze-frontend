import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FaGear, FaRightFromBracket } from "react-icons/fa6";
import styles from "./UserButton.module.scss";

export default function UserButton() {
  const { auth, logout } = useAuth();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  if (!auth) return null;
  const { fullName, imageUrl, email } = auth;

  const showTooltip = () => {
    setTooltipVisible(true);
    setButtonHover(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
    setButtonHover(false);
  };

  async function handleLogout() {
    await logout();
  }

  return (
    <div className={styles.userButtonContainer}>
      <button className={`${styles.userTagButton} ${buttonHover ? styles.hover : ""}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
        <img className={styles.userTagImage} src={imageUrl} alt="user-picture" />
        <div className={styles.userNameText}>{fullName}</div>
      </button>
      <button className={styles.settingsButton}>
        <FaGear className={styles.settingsIcon} />
      </button>
      <div className={`${styles.tooltip} ${tooltipVisible ? styles.visible : ""}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
        <div>{email}</div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FaRightFromBracket className={styles.logoutIcon} />
          Log out
        </button>
      </div>
    </div>
  );
}
