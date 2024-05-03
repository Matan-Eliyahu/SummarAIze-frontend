import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Summarize() {
  return (
    <div className="summarize">
      Summarize

      <Link to="/">
        <img src={logo} alt="logo" style={{ width: "200px" }} />
      </Link>
      
    </div>
  );
}

export default Summarize;
