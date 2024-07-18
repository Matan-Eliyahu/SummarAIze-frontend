import styles from "./SummaryDisplay.module.scss";
import { useLocation } from "react-router-dom";

function SummaryDisplay() {
  const location = useLocation();
  const text = location.state.text;

  return <div className={styles.summary}>{text ? text : "No text"}</div>;
}

export default SummaryDisplay;
