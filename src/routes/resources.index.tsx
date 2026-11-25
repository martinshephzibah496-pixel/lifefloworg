import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import { planners } from "@/lib/planners";
import { recommendationCategories } from "@/lib/affiliate";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/resources/")({
  head: () => seo({ title: "Resources: Checklists, Planners & Recommendations", description: "Free first-time homebuyer checklist, moving timeline planner, moving budget planner, housing expense tracker and readiness assessment.", path: "/resources" }),
  component: Resources,
});

function Resources() {
  return (
    <>
      <PageHero eyebrow="Resources" title="Planners and checklists that keep you on track">Interactive, printable tools. Your progress is saved privately on your device.</PageHero>
      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planners.map((p) => (
            <Link key={p.slug} to="/resources/$slug" params={{ slug: p.slug }} className="rounded-2xl border bg-card p-6 hover:shadow-soft">
              <ClipboardCheck className="h-6 w-6 text-primary" aria-hidden /><h2 className="mt-3 text-lg font-semibold">{p.title}</h2><p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-t bg-muted py-14" aria-labelledby="rec-h">
        <div className="container-page">
          <h2 id="rec-h" className="text-3xl font-semibold">Recommended products & services</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">How to choose wisely in each category. LifeFlow has no affiliate partnerships yet — when we add any, links will be clearly labelled “Affiliate link”. See our <Link to="/affiliate-disclosure" className="text-primary underline">affiliate disclosure</Link>.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendationCategories.map((r) => (
              <div key={r.h} className="rounded-2xl border bg-card p-5">
                <h3 className="font-semibold">{r.h}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">{r.tips.map((t) => <li key={t}>{t}</li>)}</ul>
                <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">No partner listed yet</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
