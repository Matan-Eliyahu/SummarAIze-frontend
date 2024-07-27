import Layout from "../../components/Layout/Layout";
import logo from "../../assets/logo.png";
import styles from "./PrivacyPolicy.module.scss";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <Layout fullPage>
      <div className={styles.privacyPolicyBox}>
        <div className={styles.headerBox}>
          <h2>Privacy Policy</h2>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="logo" style={{ width: "100%" }} />
          </Link>
        </div>
        <div className={styles.textContainer}>
          <h5>1. Introduction</h5>
          <div className={styles.text}>
            Welcome to SummarAIze. Your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our web application. Please
            read this policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the application.
          </div>
          <h5>2. Information We Collect</h5>
          <h6 className={styles.smallTitle}>2.1. Personal Information</h6>
          <div className={styles.text}>
            We do not collect any personally identifiable information (PII) unless you voluntarily provide it. If you choose to register or use our services, we may collect information such as your
            name, email address, and other contact details.
          </div>
          <h6 className={styles.smallTitle}>2.2. Files and Content</h6>
          <div className={styles.text}>
            When you upload files (PDFs, images, audio) to SummarAIze, we process and analyze these files to generate summaries and transcriptions. We store the content of these files temporarily to
            provide you with the requested services. This content is not used for any other purpose.
          </div>
          <h6 className={styles.smallTitle}>2.3. Usage Data</h6>
          <div className={styles.text}>
            We may collect information about how you use our application, including your IP address, browser type, operating system, and usage patterns. This data helps us improve our services and
            enhance user experience.
          </div>
          <h5>3. How We Use Your Information</h5>
          <h6 className={styles.smallTitle}>3.1. To Provide Services</h6>
          <div className={styles.text}>We use the information you provide to deliver the services you request, such as processing files and generating summaries.</div>
          <h6 className={styles.smallTitle}>3.2. To Improve Our Services</h6>
          <div className={styles.text}>Usage data helps us understand how our users interact with the application, allowing us to make improvements and offer a better experience.</div>
          <h6 className={styles.smallTitle}>3.3. To Communicate with You</h6>
          <div className={styles.text}>If you provide your contact information, we may use it to respond to your inquiries, send updates, or provide support.</div>
          <h5>4. Data Retention</h5>
          <div className={styles.text}>
            We retain your files and content only for as long as necessary to fulfill the purposes for which they were collected, including providing the requested services and complying with legal
            obligations. Files and content are deleted after they are processed and the summary or transcription is provided.
          </div>
          <h5>5. Data Security</h5>
          <div className={styles.text}>
            We implement reasonable security measures to protect your information from unauthorized access, disclosure, alteration, and destruction. However, please be aware that no method of
            transmission over the internet or electronic storage is completely secure.
          </div>
          <h5>6. Third-Party Services</h5>
          <div className={styles.text}>
            SummarAIze may integrate with third-party services for certain functionalities. These third parties have their own privacy policies, and we are not responsible for their practices. We
            encourage you to review their privacy policies before using their services.
          </div>
          <h5>7. Your Rights</h5>
          <h6 className={styles.smallTitle}>7.1. Access and Correction</h6>
          <div className={styles.text}>You have the right to access and correct any personal information we hold about you. To do so, please contact us at cohenaviv2@gmail.com.</div>
          <h6 className={styles.smallTitle}>7.2. Data Deletion</h6>
          <div className={styles.text}>You can request the deletion of your files and content by contacting us. We will delete your information in accordance with our data retention policy.</div>
          <h6 className={styles.smallTitle}>7.3. Opt-Out</h6>
          <div className={styles.text}>You may opt out of receiving communications from us by following the instructions in the communication or contacting us directly.</div>
          <h5>8. Changes to This Privacy Policy</h5>
          <div className={styles.text}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the updated policy
            on our website. Your continued use of the application constitutes your acceptance of the revised policy.
          </div>
          <h5>9. Contact Us</h5>
          <div className={styles.text}>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at: Email: cohenaviv2@gmail.com</div>
        </div>
      </div>
    </Layout>
  );
}
