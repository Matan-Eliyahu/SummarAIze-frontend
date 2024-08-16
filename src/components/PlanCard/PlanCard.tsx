import { PLANS, PlanType } from "../../common/types";
import styles from "./PlanCard.module.scss";

interface PlanCardProps {
  planType: PlanType;
  onChoosePlan: (plan: PlanType) => void;
  loading: boolean;
  selected?: boolean;
  width?: string | number;
}

export default function PlanCard({ planType, onChoosePlan, loading, selected, width }: PlanCardProps) {
  const plan = PLANS[planType];

  if (!plan) return <div>No Plan</div>;

  const maxStorageText = plan.maxStorageInMb > 999 ? `${plan.maxStorageInMb / 1000} GB` : `${plan.maxStorageInMb} MB`;

  return (
    <div className={selected && selected ? styles.planCardBoxSelected : styles.planCardBox} style={{ width }}>
      <div className={styles.headerBox}>
        {plan.type.toUpperCase()} {plan.price === 0 && <div className={styles.freeTextBox}>Free</div>}
      </div>
      <div className={styles.descriptionBox}>
        <div className={styles.descriptionText}>{plan.description}</div>
      </div>
      <div className={styles.maxStorageBox}>
        Up to
        <div className={styles.maxStorageText}>{maxStorageText}</div>of Storage
      </div>
      <div className={styles.priceBox}>
        $<div className={styles.priceText}>{plan.price}</div>/ Month
      </div>
      <div className={styles.buttonBox}>
        <button className={styles.choosePlanButton} onClick={() => onChoosePlan(plan.type)} disabled={selected && selected ? selected : loading}>
          {selected && selected ? "Selected" : "Choose Plan"}
        </button>
      </div>
    </div>
  );
}
