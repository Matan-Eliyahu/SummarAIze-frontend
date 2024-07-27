import { IPlan, PlanType } from "../../common/types";
import styles from "./PlanCard.module.scss";

interface PlanCardProps {
  plan: IPlan;
  onChoosePlan: (plan: PlanType) => void;
  loading:boolean;
}

export default function PlanCard({ plan, onChoosePlan, loading }: PlanCardProps) {
  const maxStorageText = plan.maxStorageInMb > 999 ? `${plan.maxStorageInMb / 1000} GB` : `${plan.maxStorageInMb} MB`;
  return (
    <div className={styles.planCardBox}>
      <div className={styles.headerBox}>
        {plan.type.toUpperCase()} {plan.price === 0 && <div className={styles.freeTextBox}>Free</div>}
      </div>
      <div className={styles.descriptionText}>{plan.description}</div>
      <div className={styles.maxStorageBox}>
        Up to
        <div className={styles.maxStorageText}>{maxStorageText}</div>of Storage
      </div>
      <div className={styles.priceBox}>
        $<div className={styles.priceText}>{plan.price}</div>/ Month
      </div>
      <button className={styles.choosePlanButton} onClick={() => onChoosePlan(plan.type)} disabled={loading}>
        Choose Plan
      </button>
    </div>
  );
}
