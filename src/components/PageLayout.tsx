import type { ReactNode } from "react";
import SiteNavigation from "./SiteNavigation";
import styles from "./PageLayout.module.css";
export default function PageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteNavigation />
      <main className={styles.page}>
        <h1>{title}</h1>
        <div className={styles.content}>{children}</div>
      </main>
    </>
  );
}
