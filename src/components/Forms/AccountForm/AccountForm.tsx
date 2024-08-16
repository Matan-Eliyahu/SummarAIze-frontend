import { useState } from "react";
import { IAccount, IUser, PLANS, PlanType } from "../../../common/types";
import styles from "./AccountForm.module.scss";
import ImageSelector from "../ImageSelector/ImageSelector";
import PlanCard from "../../PlanCard/PlanCard";

export type AccountSection = "my-account" | "my-plan";

interface AccountFormProps {
  set: IAccount;
  onUserChange: (updatedAccount: IUser) => Promise<void>;
  onImageUpload: (image: File) => Promise<string>;
  onPlanChange: (plan: PlanType) => Promise<void>;
  section: AccountSection;
}

export default function AccountForm({ set, onUserChange, section, onPlanChange, onImageUpload }: AccountFormProps) {
  const [user, setUser] = useState<IUser>({
    ...set,
    password: "",
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [edit, setEdit] = useState(false);

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newPassword = event.target.value;
    setUser((prev) => ({ ...prev, password: newPassword }));
  }

  function handleFullNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFullName = event.target.value;
    setUser((prev) => ({ ...prev, fullName: newFullName }));
  }

  function sectionSwitch(section: AccountSection) {
    switch (section) {
      case "my-account":
        return (
          <div className={styles.sectionBox}>
            <div className={styles.accountNameBox}>
              <ImageSelector initialImgUrl={user.imageUrl} onImageSelect={setNewImage} edit={edit} />
              {edit ? <input className={styles.accountInput} type="text" value={user.fullName} onChange={handleFullNameChange} /> : user.fullName}
            </div>
            <div className={styles.accountInputBox}>
              <div className={styles.accountInputLabel}>Email Address:</div>
              {user.email}
            </div>
            {user.registrationMethod === "manual" && (
              <>
                <div className={styles.accountInputBox}>
                  <div className={styles.accountInputLabel}>{`${edit ? "New" : ""} Password:`}</div>
                  {edit ? <input className={styles.accountInput} type="password" onChange={handlePasswordChange} /> : "************"}
                </div>
                {edit && (
                  <div className={styles.accountInputBox}>
                    <div className={styles.accountInputLabel}>Confirm Password:</div>
                    <input className={styles.accountInput} type="password" />
                  </div>
                )}
              </>
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
                  <PlanCard planType={planType} key={index} onChoosePlan={onPlanChange} loading={false} selected={planType === user.plan} width="30%"/>
                ))}
            </div>
          </div>
        );
    }
  }

  async function handleButtonClick() {
    if (section === "my-account" && edit) {
      let imageUrl = user.imageUrl;
      if (newImage) {
        const imgUrl = await onImageUpload(newImage);
        if (imgUrl !== "") imageUrl = imgUrl;
      }
      const updatedUser = { ...user, imageUrl };
      await onUserChange(updatedUser);
    }
    setEdit((prev) => !prev);
  }

  function handleCancelButtonClick() {
    setEdit((prev) => !prev);
  }

  return (
    <div className={styles.accountFormBox}>
      {sectionSwitch(section)}
      <div className={styles.buttonBox}>
        {edit && (
          <button className={styles.cancelButton} onClick={handleCancelButtonClick}>
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
