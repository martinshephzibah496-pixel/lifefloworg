// Server-only payment helpers. Orders are marked paid ONLY after the provider's API confirms the charge.
import { chargeAmount } from "./store";

export type Provider = "paystack" | "flutterwave";

export function configuredProviders(): Provider[] {
  const out: Provider[] = [];
  if (process.env["PAYSTACK_SECRET_KEY"]) out.push("paystack");
  if (process.env["FLUTTERWAVE_SECRET_KEY"]) out.push("flutterwave");
  return out;
}

const ALLOWED_HOSTS = ["lifefloworg.lovable.app"];
export function safeOrigin(origin: string): string {
  const fallback = process.env["PUBLIC_SITE_URL"] || "https://lifefloworg.lovable.app";
  try {
    const u = new URL(origin);
    const extra = process.env["PUBLIC_SITE_URL"] ? [new URL(process.env["PUBLIC_SITE_URL"]).hostname] : [];
    const ok =
      (u.protocol === "https:" && (ALLOWED_HOSTS.includes(u.hostname) || extra.includes(u.hostname) || /^id-preview(-[a-z0-9]+)?--[a-z0-9-]+\.lovable\.app$/.test(u.hostname))) ||
      (u.protocol === "http:" && u.hostname === "localhost");
    return ok ? u.origin : fallback;
  } catch { return fallback; }
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function initPayment(o: { provider: Provider; reference: string; email: string; amountMinor: number; currency: string; callbackUrl: string; title: string }) {
  if (o.provider === "paystack") {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env["PAYSTACK_SECRET_KEY"]}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: o.email, amount: o.amountMinor, currency: o.currency, reference: o.reference, callback_url: o.callbackUrl, metadata: { product: o.title } }),
    });
    const j = await res.json().catch(() => null);
    if (!res.ok || !j?.status) throw new Error(`Paystack could not start checkout: ${j?.message ?? res.status}`);
    return j.data.authorization_url as string;
  }
  const res = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env["FLUTTERWAVE_SECRET_KEY"]}`, "Content-Type": "application/json" },
    body: JSON.stringify({ tx_ref: o.reference, amount: o.amountMinor / 100, currency: o.currency, redirect_url: o.callbackUrl, customer: { email: o.email }, customizations: { title: "LifeFlow Digital Store", description: o.title } }),
  });
  const j = await res.json().catch(() => null);
  if (!res.ok || j?.status !== "success") throw new Error(`Flutterwave could not start checkout: ${j?.message ?? res.status}`);
  return j.data.link as string;
}

async function verifyWithProvider(provider: Provider, reference: string): Promise<{ ok: boolean; amountMinor: number; currency: string; txId: string }> {
  if (provider === "paystack") {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env["PAYSTACK_SECRET_KEY"]}` } });
    const j = await res.json().catch(() => null);
    if (!res.ok || !j?.status) return { ok: false, amountMinor: 0, currency: "", txId: "" };
    return { ok: j.data.status === "success", amountMinor: j.data.amount, currency: j.data.currency, txId: String(j.data.id) };
  }
  const res = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env["FLUTTERWAVE_SECRET_KEY"]}` } });
  const j = await res.json().catch(() => null);
  if (!res.ok || j?.status !== "success") return { ok: false, amountMinor: 0, currency: "", txId: "" };
  return { ok: j.data.status === "successful", amountMinor: Math.round(Number(j.data.amount) * 100), currency: j.data.currency, txId: String(j.data.id) };
}

/** Confirms an order against the provider. Idempotent; safe to call from return page and webhook. */
export async function confirmByReference(reference: string): Promise<boolean> {
  const db = await admin();
  const { data: order } = await db.from("orders").select("*").eq("reference", reference).maybeSingle();
  if (!order) return false;
  if (order.status === "paid") return true;
  if (order.provider === "free") return false;
  const v = await verifyWithProvider(order.provider as Provider, reference);
  const paid = v.ok && v.amountMinor >= order.amount_minor && v.currency === order.currency;
  if (!paid) return false;
  await db.from("orders").update({ status: "paid", paid_at: new Date().toISOString(), provider_transaction_id: v.txId }).eq("id", order.id).eq("status", "pending");
  return true;
}

export async function signedPdfUrl(pdfPath: string, title: string) {
  const db = await admin();
  const { data, error } = await db.storage.from("store-pdfs").createSignedUrl(pdfPath, 60 * 15, { download: `${title.replace(/[^\w\- ]+/g, "").trim() || "lifeflow"}.pdf` });
  if (error) throw new Error("Could not prepare the download. Please try again.");
  return data.signedUrl;
}

export { chargeAmount };
