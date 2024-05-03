import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Header from "../components/Header/Header";

function Summarize() {
  return (
    <>
      <Header />
      <div className="page">
        Summarize
        <Link to="/">
          <img src={logo} alt="logo" style={{ width: "200px" }} />
        </Link>
      </div>
    </>
  );
}

export default Summarize;
