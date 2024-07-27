import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import logo from "../../assets/logo.png";
import styles from "./TermsOfService.module.scss";

export default function TermsOfService() {
  return (
    <Layout fullPage>
      <div className={styles.privacyPolicyBox}>
        <div className={styles.headerBox}>
          <h2>Terms of Service</h2>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="logo" style={{ width: "100%" }} />
          </Link>
        </div>
        <div className={styles.textContainer}>
          <h5>1. Introduction</h5>
          <div className={styles.text}>
            Welcome to SummarAIze. These Terms of Service ("Terms") govern your use of our web application. By accessing or using SummarAIze, you agree to comply with and be bound by these Terms. If
            you do not agree with any part of these Terms, please do not use our application.
          </div>
          <h5>2. Use of the Application</h5>
          <h6 className={styles.smallTitle}>2.1. Eligibility</h6>
          <div className={styles.text}>
            You must be at least 18 years old or have parental consent to use SummarAIze. By using the application, you represent and warrant that you meet these eligibility requirements.
          </div>
          <h6 className={styles.smallTitle}>2.2. User Account</h6>
          <div className={styles.text}>
            To use certain features of SummarAIze, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that
            occur under your account.
          </div>
          <h6 className={styles.smallTitle}>2.3. Acceptable Use</h6>
          <div className={styles.text}>You agree to use SummarAIze only for lawful purposes and in accordance with these Terms. You agree not to:</div>
          <ul style={{ margin: 0 }}>
            <li className={styles.text} style={{ margin: 8 }}>
              Violate any applicable laws or regulations.
            </li>
            <li className={styles.text} style={{ margin: 8 }}>
              Upload or share content that is illegal, defamatory, obscene, or infringes on the rights of others.
            </li>
            <li className={styles.text} style={{ margin: 8 }}>
              Interfere with or disrupt the operation of the application or its servers.
            </li>
            <li className={styles.text} style={{ margin: 8 }}>
              Attempt to gain unauthorized access to any part of the application or its systems.
            </li>
          </ul>
          <h5>3. File Uploads and Content</h5>
          <h6 className={styles.smallTitle}>3.1. Ownership</h6>
          <div className={styles.text}>
            You retain ownership of any files and content you upload to SummarAIze. By uploading files, you grant us a non-exclusive, worldwide, royalty-free license to use, process, and analyze these
            files to provide you with the requested services.
          </div>
          <h6 className={styles.smallTitle}>3.2. Responsibility</h6>
          <div className={styles.text}>
            You are solely responsible for the files and content you upload, including ensuring that you have the necessary rights and permissions. We do not review or verify the content and are not
            responsible for any issues arising from it.
          </div>
          <h6 className={styles.smallTitle}>3.3. Data Retention</h6>
          <div className={styles.text}>
            Files and content are retained only as long as necessary to provide the requested services. We may delete files and content after processing or upon your request in accordance with our
            Privacy Policy.
          </div>
          <h5>4. Fees and Payment</h5>
          <div className={styles.text}>
            [Include details here if applicable about any fees for premium features or services, payment terms, and refund policies. If there are no fees, you can omit this section.]
          </div>
          <h5>5. Termination</h5>
          <h6 className={styles.smallTitle}>5.1. Termination by You</h6>
          <div className={styles.text}>
            You may terminate your account at any time by contacting us. Upon termination, your access to the application will be disabled, and your files and content may be deleted in accordance with
            our data retention policy.
          </div>
          <h6 className={styles.smallTitle}>5.2. Termination by Us</h6>
          <div className={styles.text}>
            We reserve the right to suspend or terminate your access to SummarAIze if you violate these Terms or if we believe your actions may harm the application or other users.
          </div>
          <h5>6. Disclaimers and Limitations of Liability</h5>
          <h6 className={styles.smallTitle}>6.1. Disclaimers</h6>
          <div className={styles.text}>
            SummarAIze is provided on an "as is" and "as available" basis. We make no warranties or representations about the accuracy, reliability, or availability of the application or its content.
          </div>
          <h6 className={styles.smallTitle}>6.2. Limitation of Liability</h6>
          <div className={styles.text}>
            To the fullest extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages arising from your use of SummarAIze or any content therein.
          </div>
          <h5>7. Indemnification</h5>
          <div className={styles.text}>
            You agree to indemnify and hold harmless SummarAIze, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages,
            losses, and expenses arising out of your use of the application or violation of these Terms.
          </div>
          <h5>8. Governing Law</h5>
          <div className={styles.text}>
            These Terms are governed by and construed in accordance with the laws of USA, without regard to its conflict of law principles. Any disputes arising from these Terms will be resolved in
            the competent courts of USA.
          </div>
          <h5>9. Changes to These Terms</h5>
          <div className={styles.text}>
            We may update these Terms from time to time. We will notify you of any significant changes by posting the updated Terms on our website. Your continued use of the application after such
            changes constitutes your acceptance of the revised Terms.
          </div>
          <h5>10. Contact Us</h5>
          <div className={styles.text}>If you have any questions or concerns about these Terms, please contact us at: Email: cohenaviv2@gmail.com</div>
        </div>
      </div>
    </Layout>
  );
}
