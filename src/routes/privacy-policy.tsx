import { createFileRoute } from "@tanstack/react-router";
import { seo, CONTACT_EMAIL } from "@/lib/seo";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => seo({ title: "Privacy Policy", description: "How LifeFlow handles your information: what we collect, why, and your choices.", path: "/privacy-policy" }),
  component: () => (
    <LegalPage title="Privacy Policy">
      <p>LifeFlow respects your privacy. This policy explains what information is handled when you use our website.</p>
      <h2>Calculators and planners</h2><p>Numbers you enter into calculators are processed in your browser and are not sent to us. Planner and checklist progress is saved in your browser's local storage on your own device. You can clear it at any time by using the Reset buttons or clearing your browser data.</p>
      <h2>Contact form and newsletter</h2><p>When you use the contact form or newsletter signup, your own email app opens with a pre-filled message. We receive only what you choose to send: typically your name, email address and message. We use it solely to reply or to send the newsletter you requested, and you can ask us to delete it at any time.</p>
      <h2>Visitor analytics</h2><p>Our site is hosted on Lovable, which provides privacy-friendly visitor analytics. It uses no cookies, stores nothing on your device, doesn't keep IP addresses and doesn't identify visitors. It records the pages visited, where visitors came from, their country, browser, operating system and device type, how long they stay, how fast pages load, and errors. These are recorded for every visitor. Detailed data is kept for 90 days and daily summaries for a year. Lovable collects this data for us. <a href="https://lovable.dev/privacy">Lovable's privacy policy</a> explains how it handles it.</p>
      <h2>Third-party services</h2><p>We load fonts from Google Fonts, which receives your IP address when the font files are requested. We do not use advertising pixels. If we add affiliate links in future, clicking them takes you to a third-party site governed by its own privacy policy.</p>
      <h2>What we never ask for</h2><p>We never ask for bank account numbers, card details, government ID numbers or passwords.</p>
      <h2>Your rights</h2><p>Depending on where you live, you may have rights to access, correct or delete your information. Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </LegalPage>
  ),
});
