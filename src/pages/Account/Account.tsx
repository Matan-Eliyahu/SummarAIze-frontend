import { FaUserCircle } from "react-icons/fa";
import Layout from "../../components/Layout/Layout";
import styles from "./Account.module.scss"

export default function Account() {
  return (
    <Layout>
      <div className="pageTitleBox">
        <FaUserCircle className={styles.titleIcon} />
        Account
      </div>
    </Layout>
  );
}
