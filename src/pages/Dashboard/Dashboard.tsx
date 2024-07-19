import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useError } from "../../hooks/useError";
import { useAuth } from "../../hooks/useAuth";
import SummaryService, { AxiosError } from "../../services/SummaryService";
import Layout from "../../components/Layout/Layout";
import Button from "../../components/Button/Button";
import DragDrop from "../../components/DragDrop/DragDrop";
import logo from "../../assets/logo.png";
import styles from "./Dashboard.module.scss";
import Spinner from "../../components/Spinner/Spinner";

function Dashboard() {
  const { loadingAuth } = useAuth();
  const { setAlert } = useError();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Simulate a loading period of 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Clean up the timer if the component is unmounted
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
      const response = await request;
      const summary = response.data;
      navigate("/summary", { state: summary });
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
    <Layout loading={loading || loadingAuth} text="Loading dashboard...">
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
