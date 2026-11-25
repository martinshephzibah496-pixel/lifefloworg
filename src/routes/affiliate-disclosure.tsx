import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () => seo({ title: "Affiliate Disclosure", description: "How LifeFlow approaches affiliate links, how they are labelled and how we keep our educational content independent.", path: "/affiliate-disclosure" }),
  component: () => (
    <LegalPage title="Affiliate Disclosure">
      <p>LifeFlow may, in the future, earn commissions when you click certain links and buy products or services. This helps keep our tools free.</p>
      <h2>Current status</h2><p>As of the date above, LifeFlow has no active affiliate partnerships. We do not claim any endorsement or partnership that does not exist.</p>
      <h2>How affiliate links will be labelled</h2><p>Any affiliate link will be clearly marked “Affiliate link” next to the link, and pages containing them will reference this disclosure.</p>
      <h2>Our independence</h2><ul><li>Educational articles and calculators are never changed to favour a partner.</li><li>We recommend only products and services relevant to buying, renting or moving.</li><li>A commission never increases the price you pay.</li></ul>
    </LegalPage>
  ),
});
