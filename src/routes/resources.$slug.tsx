import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPlanner, planners } from "@/lib/planners";
import { seo } from "@/lib/seo";
import { PlannerView } from "@/components/site/PlannerView";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => { const p = getPlanner(params.slug); if (!p) throw notFound(); return { slug: p.slug }; },
  head: ({ params, loaderData }) => {
    const p = loaderData ? getPlanner(loaderData.slug) : undefined;
    if (!p) return { meta: [{ title: "Resource not found | LifeFlow" }, { name: "robots", content: "noindex" }] };
    return seo({ title: `${p.title} – Free & Printable`, description: `${p.description} Free interactive tool from LifeFlow.`, path: `/resources/${params.slug}` });
  },
  component: PlannerPage,
  notFoundComponent: () => <div className="container-page py-20"><h1 className="text-3xl font-semibold">Resource not found</h1><Link to="/resources" className="mt-4 inline-block text-primary">Browse resources</Link></div>,
});

function PlannerPage() {
  const { slug } = Route.useLoaderData();
  const p = getPlanner(slug)!;
  return (
    <>
      <section className="border-b bg-secondary/60"><div className="container-page py-10">
        <nav aria-label="Breadcrumb" className="no-print text-sm text-muted-foreground"><Link to="/resources" className="hover:text-foreground">Resources</Link> / {p.title}</nav>
        <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{p.title}</h1><p className="mt-3 text-lg text-muted-foreground">{p.description}</p>
      </div></section>
      <section className="container-page max-w-3xl py-10"><PlannerView key={slug} p={p} /></section>
      <section className="no-print container-page max-w-3xl pb-16"><h2 className="text-lg font-semibold">More tools</h2>
        <div className="mt-3 flex flex-wrap gap-2">{planners.filter((x) => x.slug !== slug).map((x) => <Link key={x.slug} to="/resources/$slug" params={{ slug: x.slug }} className="rounded-full border px-4 py-2 text-sm hover:border-primary">{x.title}</Link>)}</div>
      </section>
    </>
  );
}
