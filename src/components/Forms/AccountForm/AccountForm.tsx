import { useEffect, useState } from "react";
import { IAccount, IUser, PLANS, PlanType } from "../../../common/types";
import styles from "./AccountForm.module.scss";
import ImageSelector from "../ImageSelector/ImageSelector";
import PlanCard from "../../PlanCard/PlanCard";

export type AccountSection = "my-account" | "my-plan";

interface AccountFormProps {
  set: IAccount;
  onUserChange: (updatedAccount: IUser) => Promise<void>;
  onPlanChange: (plan: PlanType) => Promise<void>;
  section: AccountSection;
}

export default function AccountForm({ set, onUserChange, section, onPlanChange }: AccountFormProps) {
  const [account, setAccount] = useState<IAccount>(set);
  const [edit, setEdit] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState(set !== account);

  function sectionSwitch(section: AccountSection) {
    switch (section) {
      case "my-account":
        return (
          <div className={styles.sectionBox}>
            <div className={styles.accountNameBox}>
              <ImageSelector initialImgUrl={account.imageUrl} onImageSelect={setNewImage} edit={edit} />
              {edit ? <input className={styles.accountInput} type="text" value={account.fullName} /> : account.fullName}
            </div>
            <div className={styles.accountInputBox}>
              <div className={styles.accountInputLabel}>Email Address:</div>
              {account.email}
            </div>
            <div className={styles.accountInputBox}>
              <div className={styles.accountInputLabel}>{`${edit ? "New" : ""} Password:`}</div>
              {edit ? <input className={styles.accountInput} type="password" /> : "************"}
            </div>
            {edit && (
              <div className={styles.accountInputBox}>
                <div className={styles.accountInputLabel}>Confirm Password:</div>
                <input className={styles.accountInput} type="password" />
              </div>
            )}
          </div>
        );
      case "my-plan":
        return (
          <div className={styles.sectionBox}>
            <div className={styles.plansBox}>
              {(Object.keys(PLANS) as PlanType[])
                .filter((planType) => planType != "none")
                .map((planType, index) => (
                  <PlanCard planType={planType} key={index} onChoosePlan={onPlanChange} loading={false} selected={planType === account.plan} />
                ))}
            </div>
          </div>
        );
    }
  }

  useEffect(() => {
    setIsChanged(JSON.stringify(set) !== JSON.stringify(account));
  }, [account, set]);

  async function handleButtonClick() {
    if (edit) {
      const user: IUser = {
        fullName: account.fullName,
        email: account.email,
        password: "",
        plan: account.plan,
        imageUrl: account.imageUrl,
      };
      await onUserChange(user);
    }
    setEdit((prev) => !prev);
  }

  return (
    <div className={styles.accountFormBox}>
      {sectionSwitch(section)}
      <div className={styles.buttonBox}>
        {edit && (
          <button className={styles.cancelButton} onClick={handleButtonClick}>
            Cancel
          </button>
        )}
        {section !== "my-plan" && (
          <button className={edit ? styles.saveButton : styles.editButton} onClick={handleButtonClick}>
            {edit ? "Save" : "Edit"}
          </button>
        )}
      </div>
    </div>
  );
}
