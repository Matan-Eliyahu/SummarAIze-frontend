import React from "react"
import styles from './Welcome.module.scss'
import logo from "../../assets/logo3.png";
import { fileIconMap } from "../../common/icons";

const Welcome: React.FC = () => {
    return (
      <>
        <div className={styles.welcomeBox}>
          <div className={styles.welcomeText}>Welcome to</div>
          <img src={logo} alt="logo" className={styles.logo} />
        </div>

        <div className={styles.catchwordBox}>
          <div className={styles.catchwordText}>Transforming Text with AI</div>
          <div className={styles.iconBox}>
            {Object.values(fileIconMap).map((iconSrc, index) => (
              <img src={iconSrc} key={index} alt={"icon"} className={styles.icon} />
            ))}
          </div>
        </div>
      </>
    );
}

export default Welcome;