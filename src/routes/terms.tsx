import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, CONTACT_EMAIL } from "@/lib/seo";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => seo({ title: "Terms and Conditions", description: "The terms that govern your use of the LifeFlow website, calculators and content.", path: "/terms" }),
  component: () => (
    <LegalPage title="Terms and Conditions">
      <p>By using LifeFlow you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Educational use only</h2><p>All content, calculators and tools are provided for general educational purposes. They are not financial, legal, tax or mortgage advice. See our <Link to="/financial-disclaimer">Financial Disclaimer</Link>.</p>
      <h2>No guarantees</h2><p>We aim for accuracy but provide the site "as is" without warranties. Estimates may differ from actual offers, fees and taxes.</p>
      <h2>Limitation of liability</h2><p>To the extent permitted by law, LifeFlow is not liable for losses arising from reliance on the site's content or tools.</p>
      <h2>Intellectual property</h2><p>© LifeFlow. Site content, design and tools may not be copied or republished without permission. You may print checklists and planners for personal use.</p>
      <h2>Third-party links</h2><p>We may link to external sites, including clearly labelled affiliate links. We are not responsible for their content or practices.</p>
      <h2>Changes</h2><p>We may update these terms. Continued use means you accept the updated terms. Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </LegalPage>
  ),
});
