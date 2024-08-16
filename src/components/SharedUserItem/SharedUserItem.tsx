import { FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import { IUserSearchResult } from "../../common/types";
import styles from "./SharedUserItem.module.scss";

interface SharedUserItemProps {
  user: IUserSearchResult;
  onClick: (user: IUserSearchResult) => void;
  selected?: boolean;
}

export default function SharedUserItem({ user, onClick, selected }: SharedUserItemProps) {
  if (selected && selected) {
    return (
      <button className={styles.selectedUserButton} onClick={() => onClick(user)}>
        <img src={user.imageUrl} alt="user" className={styles.selectedUserImage} />
        <FaXmark className={styles.removeImageIcon} />
      </button>
    );
  }
  return (
    <button className={selected ? styles.userItemButtonSelected : styles.userItemButton} onClick={() => onClick(user)}>
      <img src={user.imageUrl} alt="user" className={styles.userImage} />
      <div className={styles.textBox}>
        <div className={styles.nameText}>{user.fullName}</div>
        <div className={selected ? styles.emailTextSelected : styles.emailText}>{user.email}</div>
      </div>
      {selected ? <FaMinus className={styles.removeIcon} /> : <FaPlus className={styles.addIcon} />}
    </button>
  );
}
