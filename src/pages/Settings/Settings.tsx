import Layout from "../../components/Layout/Layout";
import { FaGear } from "react-icons/fa6";
import styles from "./Settings.module.scss";

export default function Settings() {
  return (
    <Layout>
      <div className="pageTitleBox"><FaGear className={styles.titleIcon} />Settings</div>
    </Layout>
  );
}
