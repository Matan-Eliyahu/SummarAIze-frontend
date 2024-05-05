import React from "react"
import styles from './Welcome.module.scss'
import logo from "../../assets/logo.png";
import pdfIcon from "../../assets/pdf-icon.png";
import docIcon from "../../assets/doc-icon.png";
import audoiIcon from "../../assets/audio-icon.png";

const Welcome: React.FC = () => {

    const icons = [
        {
            src:pdfIcon,
            alt: "pdf-icon"
        },
        {
            src:docIcon,
            alt: "doc-icon"
        },
        {
            src:audoiIcon,
            alt: "audio-icon"
        },
    ]
    return (
        <>
            <div className={styles.welcomeBox}>
                <div className={styles.welcomeText}>Welcome to</div>
                <img src={logo} alt="logo" style={{ width: "370px" }} />
            </div>

            <div className={styles.catchwordBox}>
                <div className={styles.catchwordText}>Transforming Text with AI</div>
                <div className={styles.iconBox}>
                    {icons.map(icon => 
                        <img src={icon.src} alt={icon.alt} className={styles.icon} />
                    )}
                </div>
            </div>
        </>

    )
}

export default Welcome;