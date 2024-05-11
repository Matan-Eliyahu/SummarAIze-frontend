import Button from "../components/Button/Button";
import DragDrop from "../components/DragDrop/DragDrop";
import Header from "../components/Header/Header";
import logo from "../assets/logo.png";
import styles from '../styles/pages/Summarize.module.scss'
import { useNavigate } from "react-router-dom";

function Summarize() {

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="page">
        <DragDrop />
        <Button theme="primary" children={<img className={styles.sumBtnImg} src={logo} alt="logo" />} onClick={()=> {navigate("/summary")}}></Button>
      </div>
    </>
  );
}

export default Summarize;
