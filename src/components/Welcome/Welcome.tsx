import React from "react"
import styles from './Welcome.module.scss'
import logo from "../../assets/logo3.png";
import icons from '../../common/icons'

const Welcome: React.FC = () => {
    return (
      <>
        <div className={styles.welcomeBox}>
          <div className={styles.welcomeText}>Welcome to</div>
          <img src={logo} alt="logo" style={{ width: "370px" }} />
        </div>

        <div className={styles.catchwordBox}>
          <div className={styles.catchwordText}>Transforming Text with AI</div>
          <div className={styles.iconBox}>
            {icons.map((icon, index) => (
              <img src={icon.src} key={index} alt={icon.alt} className={styles.icon} />
            ))}
          </div>
        </div>
      </>
    );
}

export default Welcome;