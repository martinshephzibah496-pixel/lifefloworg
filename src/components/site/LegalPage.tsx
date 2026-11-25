import type { ReactNode } from "react";
import { PageHero } from "./PageHero";
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (<><PageHero eyebrow="Legal" title={title}><p className="text-sm">Last updated: 25 November 2026</p></PageHero><div className="container-page max-w-3xl py-12 prose-lf">{children}</div></>);
}
