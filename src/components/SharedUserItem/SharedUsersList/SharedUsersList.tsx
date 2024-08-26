import SharedUserItem from "../SharedUserItem";
import { FaUser } from "react-icons/fa6";
import styles from "./SharedUsersList.module.scss";
import { IUserSearchResult } from "../../../common/types";

interface SharedUsersListProps {
  users: IUserSearchResult[];
  edit: boolean;
  onClick: (user: IUserSearchResult) => void;
}

export default function SharedUsersList({ users, edit, onClick }: SharedUsersListProps) {
  return (
    <>
      <div className={styles.sharedWithLabel}>
        <FaUser className={styles.sharedWithIcon} />
        {`Share${!edit ? "d" : ""} with`}
      </div>
      <div className={styles.selectedUsersBox}>
        {users.map((user, index) => (
          <SharedUserItem mode={edit ? "selected" : "image"} key={index} user={user} onClick={onClick} selected />
        ))}
      </div>
    </>
  );
}
