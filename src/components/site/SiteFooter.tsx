import { Link } from "@tanstack/react-router";
import { Logo } from "./SiteHeader";
import { CONTACT_EMAIL } from "@/lib/seo";

export function SiteFooter() {
  const col = "flex flex-col gap-2 text-sm text-muted-foreground";
  const a = "hover:text-foreground";
  return (
    <footer className="border-t bg-muted">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Make Smarter Money Moves. Live Better. Free calculators and guides for buying, renting and moving.</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-block text-sm font-semibold text-primary">{CONTACT_EMAIL}</a>
        </div>
        <div className={col}><p className="font-semibold text-foreground">Tools</p>
          <Link className={a} to="/tools">All calculators</Link>
          <Link className={a} to="/tools/$slug" params={{ slug: "mortgage-affordability-calculator" }}>Affordability</Link>
          <Link className={a} to="/tools/$slug" params={{ slug: "rent-vs-buy-calculator" }}>Rent vs. buy</Link>
          <Link className={a} to="/resources">Planners & checklists</Link>
        </div>
        <div className={col}><p className="font-semibold text-foreground">Company</p>
          <Link className={a} to="/about">About</Link><Link className={a} to="/blog">Blog</Link>
          <Link className={a} to="/faq">FAQ</Link><Link className={a} to="/contact">Contact</Link>
        </div>
        <div className={col}><p className="font-semibold text-foreground">Legal</p>
          <Link className={a} to="/privacy-policy">Privacy Policy</Link><Link className={a} to="/terms">Terms & Conditions</Link>
          <Link className={a} to="/financial-disclaimer">Financial Disclaimer</Link><Link className={a} to="/affiliate-disclosure">Affiliate Disclosure</Link>
        </div>
      </div>
      <div className="border-t">
        <p className="container-page py-6 text-xs text-muted-foreground">© {new Date().getFullYear()} LifeFlow. All rights reserved. LifeFlow provides educational information and estimates, not personalised financial, legal or mortgage advice.</p>
      </div>
    </footer>
  );
}
