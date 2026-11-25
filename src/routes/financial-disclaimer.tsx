import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/financial-disclaimer")({
  head: () => seo({ title: "Financial Disclaimer", description: "LifeFlow provides educational information and estimates, not personalised financial, legal or mortgage advice.", path: "/financial-disclaimer" }),
  component: () => (
    <LegalPage title="Financial Disclaimer">
      <p><strong>LifeFlow provides educational information and estimates, not personalised financial, legal or mortgage advice.</strong></p>
      <h2>Calculator estimates</h2><p>Our calculators use standard formulas and the values you enter. Results are estimates and may not reflect actual loan terms, interest rates, taxes, insurance, fees or market conditions in your area.</p>
      <h2>Not a lender or adviser</h2><p>LifeFlow is not a bank, lender, mortgage broker, financial adviser, tax adviser or law firm, and does not offer or arrange credit.</p>
      <h2>Talk to a professional</h2><p>Before making financial decisions, consult qualified, licensed professionals who can consider your full circumstances and local regulations.</p>
      <h2>International users</h2><p>Rules for mortgages, taxes and tenancies differ by country and region. Adjust inputs to match your location and verify locally.</p>
    </LegalPage>
  ),
});
