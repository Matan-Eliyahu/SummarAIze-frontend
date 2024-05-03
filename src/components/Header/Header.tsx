import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import styles from "./Header.module.scss";

function Header() {
  return (
    <div className={styles.header}>
      <Link to="/">
        <img className={styles.headerImg} src={logo} alt="logo" />
      </Link>
    </div>
  );
}

export default Header;
