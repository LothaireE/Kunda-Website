import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
export const metadata: Metadata = {
  title: "Studio",
  description:
    "Explore the world of K\u00dcNDA: lifestyle, culture and shared inspiration.",
};
export default function Page() {
  return (
    <PageLayout title="Studio">
      <p>A space for ideas, inspiration and connection.</p>
      <p>
        Our studio brings together the places, objects and everyday moments that
        inspire KÜNDA.
      </p>
      <a href="/contact">Start a conversation ↗</a>
    </PageLayout>
  );
}
