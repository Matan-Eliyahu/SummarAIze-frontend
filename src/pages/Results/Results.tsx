import Button from "../../components/Button/Button";
import Layout from "../../components/Layout/Layout";
import SummaryDisplay from "../../components/SummaryDisplay/SummaryDisplay";
import { useNavigate } from "react-router-dom";
// import styles from "./Results.module.scss";

function Results() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="page">
        <SummaryDisplay></SummaryDisplay>
        <Button
          theme="primary"
          children="back"
          onClick={() => {
            navigate("/summarize");
          }}
        ></Button>
      </div>
    </Layout>
  );
}

export default Results;
