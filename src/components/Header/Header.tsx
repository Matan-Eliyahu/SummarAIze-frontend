import logo from "../../assets/logo.png";
import styles from "./Header.module.scss";
import UserButton from "../UserButton/UserButton";

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.buttonBox}>
        <UserButton />
      </div>
      <div className={styles.container}>
        <div className={styles.logoBox}>
          <img className={styles.logo} src={logo} alt="logo" />
        </div>
      </div>
    </div>
  );
}

export default Header;
