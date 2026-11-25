import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator } from "lucide-react";
import { calculators } from "@/lib/calculators";
import { planners } from "@/lib/planners";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/tools/")({
  head: () => seo({ title: "Financial Tools & Calculators", description: "Free mortgage, affordability, rent vs buy, closing cost, moving cost and budget calculators. Instant results with clear explanations.", path: "/tools" }),
  component: Tools,
});

function Tools() {
  return (
    <>
      <PageHero eyebrow="Financial tools" title="Calculators for every housing decision">Ten free calculators covering buying, renting, moving and budgeting. Results update as you type.</PageHero>
      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((c) => (
            <Link key={c.slug} to="/tools/$slug" params={{ slug: c.slug }} className="rounded-2xl border bg-card p-6 hover:shadow-soft">
              <Calculator className="h-6 w-6 text-primary" aria-hidden />
              <h2 className="mt-3 text-lg font-semibold">{c.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.short}</p>
            </Link>
          ))}
        </div>
        <h2 className="mt-14 text-2xl font-semibold">Planning tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {planners.map((p) => (
            <Link key={p.slug} to="/resources/$slug" params={{ slug: p.slug }} className="rounded-2xl border bg-card p-5 hover:shadow-soft"><h3 className="font-semibold">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.description}</p></Link>
          ))}
        </div>
      </section>
    </>
  );
}
