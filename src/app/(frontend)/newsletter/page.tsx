import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import NewsletterSubscription from "@/components/NewsletterSubscription";
export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Subscribe to K\u00dcNDA\u2019s monthly selection of art, culture, favorite places and curated finds.",
};
export default function Page() {
  return (
    <PageLayout title="Newsletter">
      <NewsletterSubscription />
    </PageLayout>
  );
}
