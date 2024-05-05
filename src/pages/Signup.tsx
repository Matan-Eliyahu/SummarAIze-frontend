
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-large.png";
import pdfIcon from "../assets/pdf-icon.png";
import docIcon from "../assets/doc-icon.png";
import audoiIcon from "../assets/audio-icon.png";
import styles from "../styles/pages/Home.module.scss";
import styles2 from "../styles/pages/Signup.module.scss";


function Signup() {

  const navigate = useNavigate();

  function handleButtonClick() {
    //vlidations and send to server 
    navigate("summarize");
  }

  return (
    <div className="signup">
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
        <form className={styles2.form}>
          <label>
          Username
            <input type="text" name="username" className={styles2.input} />
          </label>
          <label>
          Email
            <input type="email" name="email" className={styles2.input} />
          </label>
          <label>
          Password
            <input type="password" name="password" className={styles2.input} />
          </label>
          <label>
          Confirm Password
            <input type="password" name="confirmPassword" className={styles2.input} />
          </label>
        </form>

          <button className={styles.signupButton} onClick={handleButtonClick}>
            Sign up
          </button>
          <div className={styles.descriptionText}>already have an account?</div>
          <a href="/">Sign in</a>
      </div>        
    </div>
  );
}

export default Signup
