import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with K\u00dcNDA for questions, ideas and collaborations.",
};
export default function Page() {
  return (
    <PageLayout title="Contact">
      <p>For questions, ideas or collaborations, we’d love to hear from you.</p>
      <a href="mailto:kunda.contact@gmail.com">kunda.contact@gmail.com ↗</a>
    </PageLayout>
  );
}
