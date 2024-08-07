import { ReactNode } from "react";
import styles from "./Layout.module.scss";
import Spinner from "../Spinner/Spinner";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

interface LayoutProps {
  children: ReactNode;
  fullPage?: boolean;
  loading?: boolean;
  text?: string;
}

function Layout({ children, loading = false, text, fullPage }: LayoutProps) {
  const shouldShowLoading = !fullPage && loading;

  return (
    <div className={fullPage ? styles.fullPageLayout : styles.pageLayout}>
      {!fullPage && <Breadcrumbs loading={shouldShowLoading} />}
      {shouldShowLoading ? <Spinner size="m" fullPage text={text} /> : children}
    </div>
  );
}

export default Layout;
