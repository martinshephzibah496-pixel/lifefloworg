import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, ShieldCheck, BookOpen, Lock, Globe, Truck, Home, Wallet } from "lucide-react";
import { calculators } from "@/lib/calculators";
import { articles } from "@/lib/articles";
import { planners } from "@/lib/planners";
import { faqs } from "@/lib/faq";
import { seo } from "@/lib/seo";
import { Newsletter } from "@/components/site/Newsletter";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({ title: "LifeFlow – Make Smarter Money Moves. Live Better.", description: "Free home affordability, mortgage payment, rent vs buy and moving cost calculators, plus guides to help you make smarter housing and money decisions.", path: "/" }),
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "LifeFlow", url: "/" }) }],
  }),
  component: Index,
});

const featured = ["mortgage-affordability-calculator", "mortgage-payment-calculator", "rent-vs-buy-calculator", "closing-cost-calculator", "moving-cost-calculator", "first-apartment-budget-calculator"];

function Index() {
  const feat = calculators.filter((c) => featured.includes(c.slug));
  const homeArticles = articles.filter((a) => ["Home Buying", "Mortgage Education", "Homeownership Costs"].includes(a.category)).slice(0, 3);
  const moveArticles = articles.filter((a) => ["Moving and Relocation", "Personal Budgeting", "First Apartment Living"].includes(a.category)).slice(0, 3);
  return (
    <>
      <section className="bg-hero text-ink-foreground">
        <div className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-ink-foreground/10 px-3 py-1 text-sm">Free calculators · Practical guides</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">Make Smarter Money Moves. <span className="text-accent">Live Better.</span></h1>
            <p className="mt-5 max-w-xl text-lg text-ink-foreground/80">LifeFlow helps you understand the real cost of buying, renting and moving — so you can plan with confidence and make decisions that fit your life.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tools" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90">Explore Financial Tools <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link to="/blog" className="inline-flex items-center rounded-full border border-ink-foreground/30 px-6 py-3 font-semibold hover:bg-ink-foreground/10">Explore Our Guides</Link>
            </div>
          </div>
          <div className="rounded-3xl bg-card p-6 text-card-foreground shadow-soft" aria-label="Example payment breakdown">
            <p className="text-sm text-muted-foreground">Example: 350,000 home, 20% down, 6.5%, 30 years</p>
            <p className="mt-2 font-display text-4xl font-semibold">2,245<span className="text-base font-normal text-muted-foreground"> / month</span></p>
            {[["Principal & interest", 1770, "bg-primary"], ["Property tax", 350, "bg-primary-glow"], ["Insurance", 125, "bg-accent"]].map(([l, v, c]) => (
              <div key={l as string} className="mt-4">
                <div className="flex justify-between text-sm"><span>{l}</span><span className="font-semibold">{(v as number).toLocaleString("en-US")}</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className={`h-full rounded-full ${c}`} style={{ width: `${((v as number) / 2245) * 100}%` }} /></div>
              </div>
            ))}
            <Link to="/tools/$slug" params={{ slug: "mortgage-payment-calculator" }} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">Try it with your numbers <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20" aria-labelledby="calc-h">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h2 id="calc-h" className="text-3xl font-semibold md:text-4xl">Featured financial calculators</h2><p className="mt-2 text-muted-foreground">Instant, private estimates — no sign-up required.</p></div>
          <Link to="/tools" className="font-semibold text-primary">View all 10 calculators →</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feat.map((c) => (
            <Link key={c.slug} to="/tools/$slug" params={{ slug: c.slug }} className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
              <Calculator className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.short}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">Calculate →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          {[{ h: "Popular homeownership resources", icon: Home, list: homeArticles }, { h: "Moving and budgeting resources", icon: Truck, list: moveArticles }].map((b) => (
            <div key={b.h}>
              <h2 className="flex items-center gap-2 text-2xl font-semibold md:text-3xl"><b.icon className="h-6 w-6 text-primary" aria-hidden />{b.h}</h2>
              <ul className="mt-6 space-y-3">
                {b.list.map((a) => (
                  <li key={a.slug}><Link to="/blog/$slug" params={{ slug: a.slug }} className="block rounded-2xl border bg-card p-5 hover:shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{a.category}</p>
                    <h3 className="mt-1 font-semibold">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  </Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container-page mt-10">
          <h3 className="text-xl font-semibold">Planners & checklists</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {planners.map((p) => <Link key={p.slug} to="/resources/$slug" params={{ slug: p.slug }} className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary">{p.title}</Link>)}
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20" aria-labelledby="why-h">
        <h2 id="why-h" className="text-3xl font-semibold md:text-4xl">Why choose LifeFlow</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[[ShieldCheck, "Education first", "Our guides are independent from any advertising or affiliate relationships."], [Lock, "Private by design", "Calculators run in your browser. We never ask for account numbers or sensitive data."], [Globe, "Works anywhere", "Use any currency and adjust taxes and fees for your country."], [Wallet, "The full picture", "We include the costs people forget: closing, upkeep, moving and delays."]].map(([I, t, d]) => {
            const Icon = I as typeof ShieldCheck;
            return <div key={t as string} className="rounded-2xl border bg-card p-6"><Icon className="h-6 w-6 text-primary" aria-hidden /><h3 className="mt-3 font-semibold">{t as string}</h3><p className="mt-1 text-sm text-muted-foreground">{d as string}</p></div>;
          })}
        </div>
      </section>

      <section className="border-t bg-secondary/50 py-16 md:py-20" aria-labelledby="faq-h">
        <div className="container-page max-w-3xl">
          <h2 id="faq-h" className="text-3xl font-semibold md:text-4xl">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.slice(0, 4).map((f) => (
              <details key={f.q} className="group rounded-2xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{f.q}</summary><p className="mt-2 text-muted-foreground">{f.a}</p></details>
            ))}
          </div>
          <Link to="/faq" className="mt-6 inline-flex items-center gap-1 font-semibold text-primary"><BookOpen className="h-4 w-4" aria-hidden />See all FAQs</Link>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
