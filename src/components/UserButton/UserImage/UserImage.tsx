import { FaXmark } from "react-icons/fa6";
import styles from "./UserImage.module.scss";

interface UserImageProps {
  mode: "button" | "label" | "list" | "selected" | "image";
  imageUrl: string;
  fullName: string;
  onClick?: () => void;
}

export default function UserImage({ mode, imageUrl, fullName, onClick }: UserImageProps) {
  const size = mode === "label" ? 20 : mode === "button" ? 24 : mode === "list" ? 26 : 32;
  if (!imageUrl) {
    if (mode === "selected") {
      return (
        <button className={styles.userIconButton} onClick={onClick}>
          <div className={styles.userIcon} style={{ width: size, height: size }}>
            {fullName[0].toUpperCase()}
          </div>
          <FaXmark className={styles.removeImageIcon} />
        </button>
      );
    } else
      return (
        <div className={styles.userIconBox} style={{ width: size, height: size }} onClick={onClick}>
          {fullName[0].toUpperCase()}
        </div>
      );
  } else {
    if (mode === "selected") {
      return (
        <button className={styles.userImageButton}>
          <img className={styles.userImage} src={imageUrl} alt="user-picture" style={{ width: size }} onClick={onClick} />
          <FaXmark className={styles.removeImageIcon} />
        </button>
      );
    } else {
      return <img className={styles.userImage} src={imageUrl} alt="user-picture" style={{ width: size }} onClick={onClick} />;
    }
  }
}
