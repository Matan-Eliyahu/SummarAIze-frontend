import { ReactNode } from "react";
import styles from "./Layout.module.scss";
import Spinner from "../Spinner/Spinner";
import Breadcrumbs, { BreadcrumbsOptions } from "../Breadcrumbs/Breadcrumbs";

interface LayoutProps {
  children: ReactNode;
  fullPage?: boolean;
  loading?: boolean;
  text?: string;
  breadcrumbsLoading?: boolean;
  breadcrumbsOptions?: BreadcrumbsOptions;
}

function Layout({ children, loading = false, text, fullPage, breadcrumbsLoading, breadcrumbsOptions }: LayoutProps) {
  const shouldShowLoading = !fullPage && loading;
  
  return (
    <div className={fullPage ? styles.fullPageLayout : styles.pageLayout}>
      {!fullPage && <Breadcrumbs loading={breadcrumbsLoading ?? shouldShowLoading} options={breadcrumbsOptions} />}
      <div className={styles.pageBox}>
      {loading ? <Spinner size="l" fullPage text={text} /> : children}
      </div>
    </div>
  );
}

export default Layout;
