export const SITE_URL = "https://lifefloworg.lovable.app";
export function seo(o: { title: string; description: string; path: string; type?: string; image?: string | null; noindex?: boolean }) {
  const title = o.title.includes("LifeFlow") ? o.title : `${o.title} | LifeFlow`;
  const url = o.path.startsWith("http") ? o.path : `${SITE_URL}${o.path === "/" ? "/" : o.path}`;
  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: o.description },
    { property: "og:title", content: title },
    { property: "og:description", content: o.description },
    { property: "og:type", content: o.type ?? "website" },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: o.description },
  ];
  if (o.image && o.image.startsWith("https://")) {
    meta.push({ property: "og:image", content: o.image }, { name: "twitter:image", content: o.image });
  }
  if (o.noindex) meta.push({ name: "robots", content: "noindex, nofollow" });
  return { meta, links: [{ rel: "canonical", href: url }] };
}
export const CONTACT_EMAIL = "lifeflowdesk@gmail.com";
