import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../hooks/useAlert";
import { useStore } from "../../hooks/useStore";
import { useDownload } from "../../hooks/useDownload";
import { IFile, ISummaryOptions } from "../../common/types";
import { AxiosError } from "../../services/FileService";
import Layout from "../../components/Layout/Layout";
import SummaryDisplay from "../../components/SummaryDisplay/SummaryDisplay";
import SummaryOptions from "../../components/SummaryOptions/SummaryOptions";
import styles from "./File.module.scss";
import useFileManager from "../../hooks/useFileManager";
import FileDetails from "../../components/FileDetails/FileDetails";

export default function File() {
  const { fileId } = useParams<{ fileId: string }>();
  const { settings, currentFolder } = useStore();
  const { setAlert, clearAlert } = useAlert();
  const { getFile, deleteFile, updateFileText, summarizeFile, isLoading, updateFileloading } = useFileManager();
  const download = useDownload();
  const navigate = useNavigate();
  const [file, setFile] = useState<IFile | null>(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    fetchFileData();
  }, []);

  async function fetchFileData() {
    if (!fileId) {
      setAlert({
        text: "No file name",
        onButtonClick: () => {
          clearAlert();
          navigate("/");
        },
      });
      return;
    }
    const file = await getFile(fileId);
    setFile(file);
  }

  async function handleDownloadFile() {
    if (!file) return;
    try {
      await download(file.path);
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    }
  }

  function handleDeleteFile() {
    if (!file || !fileId) return;
    if (file.status === "processing") {
      setAlert({
        text: "Please wait for the file to finish processing",
      });
    } else
      setAlert({
        text: `Are you sure you want to permanently delete ${file.name} ?`,
        buttonColor: "cancel",
        secondButtonText: "Delete",
        secondButtonColor: "danger",
        onSecondButtonClick: async () => {
          clearAlert();
          const isDeleted = await deleteFile(fileId);
          if (isDeleted) navigate("/dashboard");
        },
      });
  }

  async function handleUpdateFileText(updatedTranscribe: string, updatedSummary: string) {
    if (!file || !fileId) return;
    const updatedFile = await updateFileText(fileId, updatedTranscribe, updatedSummary);
    if (updatedFile) setFile(updatedFile);
  }

  async function handleSummarize(summaryOptions: ISummaryOptions) {
    if (!file || !fileId) return;
    if (!file.transcribe) {
      setAlert({
        text: "There is no transcribe.",
      });
      return;
    }
    const isSummarized = await summarizeFile(fileId, summaryOptions);
    if (isSummarized) await fetchFileData();
  }

  return (
    <Layout loading={isLoading} breadcrumbsLoading={isLoading || updateFileloading} breadcrumbsOptions={{ file, folder: currentFolder }} text="Loading file...">
      {file && settings && (
        <div className={styles.fileBox}>
          <div className={styles.infoBox}>
            <FileDetails file={file} edit={edit} onDownloadFile={handleDownloadFile} onDeleteFile={handleDeleteFile} />
          </div>
          <div className={styles.contentBox}>
            <SummaryDisplay
              edit={edit}
              setEdit={setEdit}
              transcribe={file.transcribe}
              summary={file.summary}
              onSave={handleUpdateFileText}
              loading={updateFileloading || file.status === "processing"}
              defaultTheme={settings.defaultSummaryTheme}
            />
          </div>
          <div className={styles.optionsBox}>
            <SummaryOptions initSummaryOptions={file.summaryOptions} file={file} onSummarize={handleSummarize} disabled={isLoading || updateFileloading} />
          </div>
        </div>
      )}
    </Layout>
  );
}
