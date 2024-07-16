import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import styles from "./Header.module.scss";
import { useAuth } from "../../hooks/useAuth";

function Header() {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <div className={styles.header}>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
      <Link to="/">
        <img className={styles.headerImg} src={logo} alt="logo" />
      </Link>
    </div>
  );
}

export default Header;
