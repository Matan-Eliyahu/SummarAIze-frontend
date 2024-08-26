import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FaGear, FaRightFromBracket, FaEnvelope } from "react-icons/fa6";
import styles from "./UserButton.module.scss";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useStore } from "../../hooks/useStore";
import { useAlert } from "../../hooks/useAlert";
import UserImage from "./UserImage/UserImage";

export default function UserButton() {
  const { logout } = useAuth();
  const { setAlert, clearAlert } = useAlert();
  const { account } = useStore();
  const navigate = useNavigate();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

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
    setAlert({
      text: "Are you sure you want to log out?",
      buttonColor: "cancel",
      secondButtonText: "Logout",
      secondButtonColor: "danger",
      onSecondButtonClick: async () => {
        clearAlert();
        await logout();
      },
    });
  }

  // if (loadingAuth || account == null) {
  //   return (
  //     <div className={styles.loadingBox}>
  //       <Spinner size="xs" />
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <div className={styles.userButtonContainer}>
      {account && (
        <>
          <button className={`${styles.userTagButton} ${buttonHover ? styles.hover : ""}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onClick={handleUserClick}>
            <UserImage mode="button" imageUrl={account.imageUrl} fullName={account.fullName} />
          </button>
          <button className={styles.settingsButton} onClick={handleSettingsClick}>
            <FaGear className={styles.settingsIcon} />
          </button>
          <div className={`${styles.tooltip} ${tooltipVisible ? styles.visible : ""}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
            <div className={styles.titleBox}>
              <UserImage mode="label" imageUrl={account.imageUrl} fullName={account.fullName} />
              {account.fullName}
            </div>
            <div className={styles.titleBox}>
              <FaEnvelope className={styles.titleIcon} />
              {account.email}
            </div>
            <div className={styles.tooltipButtonBox}>
              <button className={styles.accountButton} onClick={handleUserClick}>
                <FaUserCircle className={styles.logoutIcon} />
                Account
              </button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <FaRightFromBracket className={styles.logoutIcon} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
