import logo from "../../assets/logo.png";
import styles from "./Header.module.scss";
import UserButton from "../UserButton/UserButton";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logoBox}>
        <Link to="/dashboard">
          <img className={styles.logo} src={logo} alt="logo" />
        </Link>
      </div>
      <div className={styles.buttonBox}>
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
