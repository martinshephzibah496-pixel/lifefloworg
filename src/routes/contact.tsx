import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail } from "lucide-react";
import { seo, CONTACT_EMAIL } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => seo({ title: "Contact LifeFlow", description: "Contact the LifeFlow team with questions, feedback or partnership enquiries at lifeflowdesk@gmail.com.", path: "/contact" }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  topic: z.string(),
  message: z.string().trim().min(10, "Message should be at least 10 characters.").max(1000, "Message must be under 1000 characters."),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "General question", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { const er: Record<string, string> = {}; for (const i of r.error.issues) er[String(i.path[0])] ??= i.message; setErrors(er); return; }
    setErrors({});
    const body = `Name: ${r.data.name}\nEmail: ${r.data.email}\n\n${r.data.message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[LifeFlow] ${r.data.topic}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }
  const field = "h-11 w-full rounded-xl border bg-background px-3";
  const Err = ({ k }: { k: string }) => (errors[k] ? <p id={`${k}-e`} className="mt-1 text-xs text-destructive">{errors[k]}</p> : null);
  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you">Questions, feedback or ideas for new tools — send us a message.</PageHero>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border bg-card p-6">
          <div><label htmlFor="name" className="text-sm font-medium">Name</label><input id="name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors["name"]} aria-describedby="name-e" /><Err k="name" /></div>
          <div><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" type="email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors["email"]} aria-describedby="email-e" /><Err k="email" /></div>
          <div><label htmlFor="topic" className="text-sm font-medium">Topic</label>
            <select id="topic" className={field} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>{["General question", "Calculator feedback", "Content suggestion", "Partnership enquiry", "Privacy request"].map((t) => <option key={t}>{t}</option>)}</select></div>
          <div><label htmlFor="message" className="text-sm font-medium">Message</label><textarea id="message" rows={6} className="w-full rounded-xl border bg-background p-3" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-invalid={!!errors["message"]} aria-describedby="message-e" /><Err k="message" /></div>
          <p className="text-xs text-muted-foreground">Please don't include account numbers or other sensitive financial details.</p>
          <button className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Send message</button>
          {sent && <p role="status" className="rounded-xl bg-secondary p-3 text-sm">Your email app has opened with your message. Press send there to reach us.</p>}
        </form>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-hero p-6 text-ink-foreground"><Mail className="h-6 w-6" aria-hidden /><h2 className="mt-3 font-display text-xl font-semibold">Email us directly</h2><a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block font-semibold underline">{CONTACT_EMAIL}</a><p className="mt-2 text-sm text-ink-foreground/80">We aim to reply within a few business days.</p></div>
          <p className="text-sm text-muted-foreground">LifeFlow can't give personalised financial, legal or mortgage advice.</p>
        </aside>
      </div>
    </>
  );
}
