import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "KÜNDA", template: "%s — KÜNDA" },
  description:
    "KÜNDA, a space and a community united around lifestyle, passions, sharing, and connecting with others.",
  icons: { icon: "/logos/kunda-logo-01.png" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
