import { createFileRoute, Link } from "@tanstack/react-router";
import { faqs } from "@/lib/faq";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/faq")({
  head: () => ({ ...seo({ title: "Frequently Asked Questions", description: "Answers about LifeFlow's free financial calculators, privacy, accuracy, international use and how to contact us.", path: "/faq" }),
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }] }),
  component: () => (
    <>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" />
      <div className="container-page max-w-3xl space-y-3 py-12">
        {faqs.map((f) => <details key={f.q} className="rounded-2xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{f.q}</summary><p className="mt-2 text-muted-foreground">{f.a}</p></details>)}
        <p className="pt-4 text-muted-foreground">Still have a question? <Link to="/contact" className="text-primary underline">Contact us</Link>.</p>
      </div>
    </>
  ),
});
