import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { articles, getArticle } from "@/lib/articles";
import { getCalculator } from "@/lib/calculators";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => { const a = getArticle(params.slug); if (!a) throw notFound(); return { slug: a.slug }; },
  head: ({ params, loaderData }) => {
    const a = loaderData ? getArticle(loaderData.slug) : undefined;
    if (!a) return { meta: [{ title: "Article not found | LifeFlow" }, { name: "robots", content: "noindex" }] };
    return { ...seo({ title: a.title, description: a.description, path: `/blog/${params.slug}`, type: "article" }),
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.description, datePublished: a.date, articleSection: a.category, author: { "@type": "Organization", name: "LifeFlow" }, publisher: { "@type": "Organization", name: "LifeFlow" } }) }] };
  },
  component: ArticlePage,
  notFoundComponent: () => <div className="container-page py-20"><h1 className="text-3xl font-semibold">Article not found</h1><Link to="/blog" className="mt-4 inline-block text-primary">Back to the blog</Link></div>,
});

function ArticlePage() {
  const { slug } = Route.useLoaderData();
  const a = getArticle(slug)!;
  const related = [...articles.filter((x) => x.slug !== slug && x.category === a.category), ...articles.filter((x) => x.slug !== slug && x.category !== a.category)].slice(0, 3);
  return (
    <article>
      <header className="border-b bg-secondary/60"><div className="container-page max-w-3xl py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link to="/blog" className="hover:text-foreground">Blog</Link> / {a.category}</nav>
        <h1 className="mt-3 text-3xl font-semibold md:text-5xl">{a.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{a.description}</p>
        <p className="mt-4 text-sm text-muted-foreground"><time dateTime={a.date}>{new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time> · {a.minutes} min read · By the LifeFlow team</p>
      </div></header>
      <div className="container-page grid max-w-5xl gap-10 py-12 lg:grid-cols-[1fr_280px]">
        <div className="prose-lf">
          {a.sections.map((s) => <section key={s.h}><h2>{s.h}</h2>{s.p.map((p) => <p key={p}>{p}</p>)}</section>)}
          <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">This article is for general education only and isn't personalised financial advice. Read our <Link to="/financial-disclaimer">financial disclaimer</Link>.</p>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-hero p-5 text-ink-foreground"><h2 className="font-display text-lg font-semibold">Run your numbers</h2>
            <ul className="mt-3 space-y-2">{a.calculators.map((s) => { const c = getCalculator(s); return c ? <li key={s}><Link to="/tools/$slug" params={{ slug: s }} className="block rounded-lg bg-ink-foreground/10 px-3 py-2 text-sm font-medium hover:bg-ink-foreground/20">{c.title} →</Link></li> : null; })}</ul>
          </div>
        </aside>
      </div>
      <section className="border-t bg-muted py-12"><div className="container-page max-w-5xl"><h2 className="text-2xl font-semibold">Related articles</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">{related.map((r) => <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="rounded-2xl border bg-card p-5 hover:shadow-soft"><p className="text-xs font-semibold uppercase text-primary">{r.category}</p><h3 className="mt-1 font-semibold">{r.title}</h3></Link>)}</div>
        <Link to="/tools" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore all financial tools</Link>
      </div></section>
    </article>
  );
}
