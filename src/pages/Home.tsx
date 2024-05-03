import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Button from "../components/Button/Button";

function Home() {
  const navigate = useNavigate();

  function handleButtonClick() {
    navigate("summarize");
  }

  return (
    <div className="home">
      Home
      <img src={logo} alt="logo" style={{ width: "200px" }} />
      <input type="text" />
      <Button
        text="signup"
        theme="primary"
        onClick={handleButtonClick}
        size="s"
      />
    </div>
  );
}

export default Home;
