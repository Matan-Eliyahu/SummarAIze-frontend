import { ReactNode } from "react";
import styles from "./Layout.module.scss";
import Spinner from "../Spinner/Spinner";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

interface LayoutProps {
  children: ReactNode;
  fullPage?: boolean;
  loading?: boolean;
  text?: string;
  breadcrumbsLoading?: boolean;
}

function Layout({ children, loading = false, text, fullPage,breadcrumbsLoading }: LayoutProps) {
  const shouldShowLoading = !fullPage && loading;

  return (
    <div className={fullPage ? styles.fullPageLayout : styles.pageLayout}>
      {!fullPage && <Breadcrumbs loading={breadcrumbsLoading ?? shouldShowLoading} />}
      {shouldShowLoading ? <Spinner size="l" fullPage text={text} /> : children}
    </div>
  );
}

export default Layout;
