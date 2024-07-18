import { fileIconMap } from "../../common/icons";
import logo from "../../assets/logo3.png";
import styles from "./Welcome.module.scss";
import { useEffect, useState } from "react";

interface WelcomeProps {
  mode: "home" | "sign-up";
}

function Welcome({ mode }: WelcomeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const logoWidth = mode == "home" ? 400 : 320;

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className={styles.welcomeBox}>
      {mode == "home" && <div className={styles.welcomeText}>Welcome to</div>}
      <div className={styles.logoBox} style={{ justifyContent: mode == "home" ? "center" : "start" }}>
        <img style={{ width: logoWidth }} src={logo} alt="logo" />
      </div>
      {mode == "home" && (
        <div className={`${styles.catchwordBox} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.catchwordText}>Transforming Text with AI</div>
          <div className={styles.iconBox}>
            {Object.values(fileIconMap).map((iconSrc, index) => (
              <img src={iconSrc} key={index} alt={"icon"} className={styles.icon} />
            ))}
          </div>
        </div>
      )}
      <div className={mode == "home" ? styles.descriptionText : styles.signupText}>
        {mode == "home"
          ? "Start summarizing documents, photos, and recordings effortlessly. Experience the power of AI-driven summaries tailored to your needs"
          : "Discover SummarAIze, your ultimate platform for effortless document management and insight. Effortlessly upload PDFs, images, and audio files, and watch as SummarAIze employs cutting-edge AI to generate concise summaries. Dive deeper with our smart file search feature, allowing you to explore, edit, and fine-tune summaries to perfection. Gain unprecedented efficiency as you seamlessly toggle between summarized highlights and detailed original content presented as text, all made possible through the transformative power of artificial intelligence."}
      </div>
    </div>
  );
}

export default Welcome;
