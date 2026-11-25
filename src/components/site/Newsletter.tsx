import { useState } from "react";
import { z } from "zod";
import { CONTACT_EMAIL } from "@/lib/seo";

const schema = z.string().trim().email("Please enter a valid email address.").max(255);

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(email);
    if (!r.success) { setError(r.error.issues[0]?.message ?? "Invalid email"); return; }
    setError("");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Newsletter subscription")}&body=${encodeURIComponent(`Please subscribe ${r.data} to the LifeFlow newsletter.`)}`;
    setDone(true);
  }
  return (
    <section className="bg-hero text-ink-foreground" aria-labelledby="nl-h">
      <div className="container-page grid gap-8 py-16 md:grid-cols-2 md:items-center">
        <div>
          <h2 id="nl-h" className="text-3xl font-semibold md:text-4xl">Smarter money notes, monthly.</h2>
          <p className="mt-3 text-ink-foreground/80">New guides, calculators and checklists for buying, renting and moving. No spam — unsubscribe anytime. We only ask for your email.</p>
        </div>
        <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-invalid={!!error} aria-describedby="nl-msg"
            className="h-12 flex-1 rounded-full border border-ink-foreground/20 bg-ink-foreground/10 px-5 text-ink-foreground placeholder:text-ink-foreground/50" />
          <button className="h-12 rounded-full bg-accent px-6 font-semibold text-accent-foreground hover:opacity-90">Subscribe</button>
          <p id="nl-msg" role="status" className="text-sm sm:sr-only">{error || (done ? "Your email app opened to confirm your subscription." : "")}</p>
        </form>
        {(error || done) && <p className="text-sm md:col-start-2" aria-hidden>{error || "Your email app opened — send the message to confirm your subscription."}</p>}
      </div>
    </section>
  );
}
