import { useEffect, useState } from "react";
import { useError } from "../../hooks/useError";
import SummaryService, { AxiosError } from "../../services/SummaryService";
import Layout from "../../components/Layout/Layout";
import Button from "../../components/Button/Button";
import DragDrop from "../../components/DragDrop/DragDrop";
import logo from "../../assets/logo.png";
import styles from "./Dashboard.module.scss";

function Dashboard() {
  const { setAlert } = useError();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  async function handleSummarize() {
    if (!file) {
      setAlert({ text: "There is no file" });
      return;
    }

    const { request } = SummaryService.createSummary(file);
    setLoading(true);
    try {
      await request;
      console.log("done")
      // const summary = response.data;
      // navigate("/summary", { state: summary });
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      console.log("Summarize error: ", error);
    } finally {
      setLoading(false);
    }
  }

  function handleFileDrop(files: File[]) {
    setFile(files[0]);
  }

  return (
    <Layout loading={loading} text="Loading dashboard...">
      <div className={styles.dashboardBox}>
        <div className={styles.infoBox}>
          <div className={styles.fakeBox}>
            {/* <Spinner size="m" /> */}
          </div>
          <div className={styles.fakeBox2}>
            {/* <Spinner size="m" /> */}
          </div>
          <div className={styles.fakeBox3}>
            {/* <Spinner size="m" /> */}
          </div>
        </div>
        <div className={styles.dragDropBox}>
          <DragDrop onFileDrop={handleFileDrop} />
        </div>
      </div>
      {/* <Button theme="primary" children={<img className={styles.sumBtnImg} src={logo} alt="logo" />} onClick={handleSummarize}></Button> */}
    </Layout>
  );
}

export default Dashboard;
