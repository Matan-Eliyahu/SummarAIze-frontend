import Button from "../components/Button/Button";
import Header from "../components/Header/Header";
import SummaryDisplay from "../components/SummaryDisplay/SummaryDisplay";
import { useNavigate } from "react-router-dom";
import styles from '../styles/pages/Summary.module.scss'

function Summary() {

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="page">
        <SummaryDisplay></SummaryDisplay>
        <Button theme="primary" children="back" onClick={()=> {navigate("/summarize")}}></Button>
      </div>
    </>
  );
}

export default Summary;
