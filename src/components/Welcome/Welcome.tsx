import { fileIconMap } from "../../common/icons";
import logo from "../../assets/logo3.png";
import styles from "./Welcome.module.scss";

interface WelcomeProps {
  mode: "home" | "sign-up";
}

function Welcome({ mode }: WelcomeProps) {
  const logoWidth = mode == "home" ? 360 : 320;

  return (
    <div className={styles.welcomeBox}>
      {mode == "home" && <div className={styles.welcomeText}>Welcome to</div>}
      <div className={styles.logoBox} style={{ justifyContent: mode == "home" ? "center" : "start" }}>
        <img style={{ width: logoWidth }} src={logo} alt="logo" />
      </div>
      {mode == "home" && (
        <div className={styles.catchwordBox}>
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
          ? "Start summarizing PDFs, images, and audio recordings with AI-driven accuracy. Customize summaries to your needs and explore your files with smart search."
          : "Discover SummarAIze, your ultimate platform for effortless document management and insight. Effortlessly upload PDFs, images, and audio files, and watch as SummarAIze employs cutting-edge AI to generate concise summaries. Dive deeper with our smart file search feature, allowing you to explore, edit, and fine-tune summaries to perfection. Gain unprecedented efficiency as you seamlessly toggle between summarized highlights and detailed original content presented as text, all made possible through the transformative power of artificial intelligence."}
      </div>
    </div>
  );
}

export default Welcome;
