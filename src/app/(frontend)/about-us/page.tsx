import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
export const metadata: Metadata = {
  title: "About us",
  description:
    "K\u00dcNDA is a space and a community united around lifestyle, passions, sharing and connecting with others.",
};
export default function Page() {
  return (
    <PageLayout title="About us">
      <p>
        KÜNDA is a space and a community united around lifestyle, passions,
        sharing and connecting with others.
      </p>
      <p>
        Art, culture, favorite places and curated finds: we share what inspires
        us and invite you to be part of the conversation.
      </p>
      <a href="/newsletter">Stay connected ↗</a>
    </PageLayout>
  );
}
