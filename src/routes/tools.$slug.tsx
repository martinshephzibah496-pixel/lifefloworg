import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { calculators, getCalculator } from "@/lib/calculators";
import { getArticle } from "@/lib/articles";
import { seo } from "@/lib/seo";
import { CalculatorView } from "@/components/site/CalculatorView";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => { const c = getCalculator(params.slug); if (!c) throw notFound(); return { slug: c.slug }; },
  head: ({ params, loaderData }) => {
    const c = loaderData ? getCalculator(loaderData.slug) : undefined;
    if (!c) return { meta: [{ title: "Calculator not found | LifeFlow" }, { name: "robots", content: "noindex" }] };
    const base = seo({ title: c.seoTitle, description: c.description, path: `/tools/${params.slug}` });
    return { ...base, scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: c.title, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0" }, description: c.description }) }] };
  },
  component: CalcPage,
  notFoundComponent: () => <div className="container-page py-20"><h1 className="text-3xl font-semibold">Calculator not found</h1><Link to="/tools" className="mt-4 inline-block text-primary">Browse all calculators</Link></div>,
});

function CalcPage() {
  const { slug } = Route.useLoaderData();
  const c = getCalculator(slug)!;
  const art = c.article ? getArticle(c.article) : undefined;
  const others = calculators.filter((x) => x.slug !== slug).slice(0, 4);
  return (
    <>
      <section className="border-b bg-secondary/60">
        <div className="container-page py-10">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link to="/tools" className="hover:text-foreground">Financial Tools</Link> / <span>{c.title}</span></nav>
          <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{c.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{c.short}</p>
        </div>
      </section>
      <section className="container-page py-10"><CalculatorView key={slug} calc={c} /></section>
      <section className="container-page grid gap-6 pb-16 md:grid-cols-2">
        {art && <Link to="/blog/$slug" params={{ slug: art.slug }} className="rounded-2xl border bg-card p-6 hover:shadow-soft"><p className="text-xs font-semibold uppercase text-primary">Related guide</p><h2 className="mt-1 text-lg font-semibold">{art.title}</h2><p className="mt-1 text-sm text-muted-foreground">{art.description}</p></Link>}
        <div className="rounded-2xl border bg-card p-6"><h2 className="text-lg font-semibold">More calculators</h2>
          <ul className="mt-2 space-y-1.5">{others.map((o) => <li key={o.slug}><Link to="/tools/$slug" params={{ slug: o.slug }} className="text-primary hover:underline">{o.title}</Link></li>)}</ul>
        </div>
      </section>
    </>
  );
}
