import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useError } from "../../hooks/useError";
import SummaryService, { AxiosError } from "../../services/SummaryService";
import Layout from "../../components/Layout/Layout";
import Button from "../../components/Button/Button";
import DragDrop from "../../components/DragDrop/DragDrop";
import logo from "../../assets/logo.png";
import styles from "./Summarize.module.scss";

function Summarize() {
  const { setAlert } = useError();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSummarize() {
    if (!file) {
      console.log("No file!");
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
    <Layout loading={loading}>
      <DragDrop onFileDrop={handleFileDrop} />
      <Button theme="primary" children={<img className={styles.sumBtnImg} src={logo} alt="logo" />} onClick={handleSummarize}></Button>
    </Layout>
  );
}

export default Summarize;