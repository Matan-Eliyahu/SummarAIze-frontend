import { FaBox, FaFileArrowDown, FaTrash, FaUpload } from 'react-icons/fa6';
import { fileIconMap } from '../../common/icons';
import { IFile } from '../../common/types';
import styles from './FileDetails.module.scss'
import moment from 'moment';
import { capitalizeFirstLetter, truncateFileName } from '../../utils/text';
import { statusIconSwitch } from '../SmartFolder/FileItem/iconUtils';

interface FileDetailsProps {
  file: IFile;
  edit: boolean;
  onDownloadFile: () => void;
  onDeleteFile: () => void;
}

export default function FileDetails({file,edit,onDownloadFile,onDeleteFile}:FileDetailsProps) {
  return (
    <>
      <div className={styles.titleBox}>
        <img className={styles.fileTitleIcon} src={fileIconMap[file.type]} alt="file-image" />
        {file.name && truncateFileName(file.name, 24)}
      </div>
      <div className={styles.smallTextTitleBox}>
        {statusIconSwitch(file.status)}
        {file.status && capitalizeFirstLetter(file.status)}
      </div>
      <div className={styles.smallTextTitleBox}>
        <FaUpload className={styles.fileTitleIcon} />
        {moment(file.uploadedAt).format("DD/MM/YYYY HH:mm:ss")}
      </div>
      <div className={styles.smallTextTitleBox}>
        <FaBox className={styles.fileTitleIcon} />
        {`${file.size} MB`}
      </div>
      <button className={styles.downloadButton} onClick={onDownloadFile}>
        <FaFileArrowDown className={styles.downloadButtonIcon} />
        Download file
      </button>
      {edit && (
        <button className={styles.deleteButton} onClick={onDeleteFile}>
          <FaTrash className={styles.deleteButtonIcon} />
          Delete file
        </button>
      )}
    </>
  );
}
