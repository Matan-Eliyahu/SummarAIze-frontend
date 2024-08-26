import { FaPlus, FaXmark } from "react-icons/fa6";
import { IUserSearchResult } from "../../common/types";
import styles from "./SharedUserItem.module.scss";
import UserImage from "../UserButton/UserImage/UserImage";

interface SharedUserItemProps {
  mode: "list" | "image" | "selected";
  user: IUserSearchResult;
  onClick: (user: IUserSearchResult) => void;
  selected: boolean;
}

export default function SharedUserItem({ mode, user, onClick, selected }: SharedUserItemProps) {
  const { imageUrl, fullName } = user;

  function handleClick() {
    onClick(user);
  }

  switch (mode) {
    case "image":
      return <UserImage mode="image" imageUrl={imageUrl} fullName={fullName} onClick={handleClick} />;
    case "list":
      return (
        <button className={selected ? styles.userItemButtonSelected : styles.userItemButton} onClick={handleClick}>
          <UserImage mode="list" imageUrl={imageUrl} fullName={fullName} />
          <div className={styles.textBox}>
            <div className={styles.nameText}>{user.fullName}</div>
            <div className={selected ? styles.emailTextSelected : styles.emailText}>{user.email}</div>
          </div>
          {selected && <div className={styles.selectedBadgeBox}>Selected</div>}
          {selected ? <FaXmark className={styles.removeIcon} /> : <FaPlus className={styles.addIcon} />}
        </button>
      );
    case "selected":
      return <UserImage mode="selected" imageUrl={imageUrl} fullName={fullName} onClick={handleClick} />;
  }
}
