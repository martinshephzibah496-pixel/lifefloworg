import { Link } from "@tanstack/react-router";
import { Menu, X, Leaf } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/tools", label: "Financial Tools" },
  { to: "/resources", label: "Resources" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold" aria-label="LifeFlow home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Leaf className="h-5 w-5" aria-hidden /></span>
      LifeFlow
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "text-foreground bg-muted" }}>{n.label}</Link>
          ))}
        </nav>
        <Link to="/tools" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 lg:inline-flex">Start calculating</Link>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t bg-background lg:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col py-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-medium hover:bg-muted">{n.label}</Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
