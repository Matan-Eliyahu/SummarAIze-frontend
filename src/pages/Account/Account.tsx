import { FaUserCircle } from "react-icons/fa";
import Layout from "../../components/Layout/Layout";
import styles from "./Account.module.scss";
import { useEffect, useState } from "react";

export default function Account() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout loading={loading} text="Loading account...">
      <div className="pageTitleBox">
        <FaUserCircle className={styles.titleIcon} />
        Account
      </div>
    </Layout>
  );
}
