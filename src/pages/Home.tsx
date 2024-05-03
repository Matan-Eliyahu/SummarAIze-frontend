import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-large.png";
import pdfIcon from "../assets/pdf-icon.png";
import docIcon from "../assets/doc-icon.png";
import audoiIcon from "../assets/audio-icon.png";
import styles from "../styles/pages/Home.module.scss";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";

function Home() {
  const navigate = useNavigate();

  function handleButtonClick() {
    navigate("signup");
  }

  function handleButton2Click() {
    navigate("summarize");
  }

  return (
    <div className="home">
      <div className={styles.welcomeBox}>
        <div className={styles.welcomeText}>Welcome to</div>
        <img src={logo} alt="logo" style={{ width: "370px" }} />
      </div>

      <div className={styles.catchwordBox}>
        <div className={styles.catchwordText}>Transforming Text with AI</div>
        <div className={styles.iconBox}>
          <img src={pdfIcon} alt="pdf-icon" className={styles.icon} />
          <img src={docIcon} alt="doc-icon" className={styles.icon} />
          <img src={audoiIcon} alt="audio-icon" className={styles.icon} />
        </div>
      </div>

      <div className={styles.buttonBox}>
        <button className={styles.googleButton} onClick={handleButton2Click}>
          <FcGoogle size={25} />
          Continue with Google
        </button>
        <button className={styles.facebookButton} onClick={handleButton2Click}>
            <MdFacebook size={25} className={styles.facebookIcon} />
          Continue with Facebook
        </button>
        <button className={styles.appleButton} onClick={handleButton2Click}>
          Continue with Apple
        </button>
        <button className={styles.signupButton} onClick={handleButtonClick}>
          Sign up
        </button>
      </div>

      <div className={styles.descriptionText}>Start summarizing documents, photos, and recordings effortlessly. Experience the power of AI-driven summaries tailored to your needs</div>
    </div>
  );
}

export default Home;
