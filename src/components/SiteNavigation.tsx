"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteNavigation.module.css";
const links = [
  ["/studio", "Studio"],
  ["/newsletter", "Newsletter"],
  ["/about-us", "About us"],
  ["/contact", "Contact"],
];
export default function SiteNavigation({
  awaitingIntro = false,
}: {
  awaitingIntro?: boolean;
}) {
  const pathname = usePathname();
  return (
    <header
      className={`${styles["site-header"]} ${awaitingIntro ? styles["awaiting-intro"] : ""}`}
      inert={awaitingIntro}
    >
      <Link className={styles.wordmark} href="/" aria-label="KÜNDA home">
        KÜNDA
      </Link>
      <nav aria-label="Main navigation">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
