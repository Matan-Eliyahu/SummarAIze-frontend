import { ReactNode } from "react";
import styles from "./Layout.module.scss";
import Spinner from "../Spinner/Spinner";

interface LayoutProps {
  children: ReactNode;
  loading?: boolean;
  text?: string;
}

const Layout = ({ children, loading, text }: LayoutProps) => {
  return <div className={styles.pageLayout}>{loading ? <Spinner size="m" fullPage text={text} /> : children}</div>;
};

export default Layout;
