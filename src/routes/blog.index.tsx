import { createFileRoute, Link } from "@tanstack/react-router";
import { articles, categories } from "@/lib/articles";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/blog/")({
  head: () => seo({ title: "Blog: Home Buying, Renting, Moving & Budgeting Guides", description: "Practical guides on home buying, mortgages, renting vs buying, moving, first apartments, homeownership costs and financial planning.", path: "/blog" }),
  component: Blog,
});

function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog & guides" title="Clear answers to big money questions">Independent, practical guides written to help you decide — not to sell you something.</PageHero>
      <div className="container-page py-12">
        <nav aria-label="Categories" className="flex flex-wrap gap-2">
          {categories.map((c) => <a key={c} href={`#${c.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary">{c}</a>)}
        </nav>
        {categories.map((c) => {
          const list = articles.filter((a) => a.category === c);
          return (
            <section key={c} id={c.toLowerCase().replace(/[^a-z]+/g, "-")} className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-semibold">{c}</h2>
              {list.length === 0 ? <p className="mt-3 text-muted-foreground">See related guides in other categories.</p> : (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {list.map((a) => (
                    <Link key={a.slug} to="/blog/$slug" params={{ slug: a.slug }} className="rounded-2xl border bg-card p-6 hover:shadow-soft">
                      <h3 className="text-lg font-semibold">{a.title}</h3><p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                      <p className="mt-3 text-xs text-muted-foreground">{a.minutes} min read</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
