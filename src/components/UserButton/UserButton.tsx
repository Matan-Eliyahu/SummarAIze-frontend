import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FaGear, FaRightFromBracket, FaEnvelope } from "react-icons/fa6";
import styles from "./UserButton.module.scss";
import { useNavigate } from "react-router-dom";

export default function UserButton() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  if (!auth) return null;
  const { fullName, imageUrl, email } = auth;

  function showTooltip() {
    setTooltipVisible(true);
    setButtonHover(true);
  }

  function hideTooltip() {
    setTooltipVisible(false);
    setButtonHover(false);
  }

  function handleSettingsClick() {
    navigate("/dashboard/settings");
  }

  function handleUserClick() {
    navigate("/dashboard/account");
  }

  async function handleLogout() {
    setTooltipVisible(false);
    await logout();
  }

  return (
    <div className={styles.userButtonContainer}>
      <button className={`${styles.userTagButton} ${buttonHover ? styles.hover : ""}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onClick={handleUserClick}>
        <img className={styles.userTagImage} src={imageUrl} alt="user-picture" />
      </button>
      <button className={styles.settingsButton} onClick={handleSettingsClick}>
        <FaGear className={styles.settingsIcon} />
      </button>
      <div className={`${styles.tooltip} ${tooltipVisible ? styles.visible : ""}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
        <div className={styles.titleBox}>
          <img className={styles.userTagImage} style={{ width: 20 }} src={imageUrl} alt="user-picture" />
          {fullName}
        </div>
        <div className={styles.titleBox}>
          <FaEnvelope className={styles.titleIcon} />
          {email}
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FaRightFromBracket className={styles.logoutIcon} />
          Log out
        </button>
      </div>
    </div>
  );
}
