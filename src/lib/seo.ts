export function seo(o: { title: string; description: string; path: string; type?: string }) {
  const title = o.title.includes("LifeFlow") ? o.title : `${o.title} | LifeFlow`;
  return {
    meta: [
      { title },
      { name: "description", content: o.description },
      { property: "og:title", content: title },
      { property: "og:description", content: o.description },
      { property: "og:type", content: o.type ?? "website" },
      { property: "og:url", content: o.path },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: o.description },
    ],
    links: [{ rel: "canonical", href: o.path }],
  };
}
export const CONTACT_EMAIL = "lifeflowdesk@gmail.com";
