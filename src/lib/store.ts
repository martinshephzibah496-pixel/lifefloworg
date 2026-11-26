// Shared store types and pure helpers (safe for browser and server).
export type StoreProduct = {
  id: string; slug: string; title: string; summary: string; description: string; category: string;
  price_minor: number; currency: string; is_free: boolean; cover_url: string | null; pdf_path: string | null;
  file_size_bytes: number | null; page_count: number | null; download_info: string; published: boolean; featured: boolean;
  created_at: string; updated_at: string;
};
export type PublicProduct = Omit<StoreProduct, "pdf_path"> & { has_file: boolean };
export type AffiliateProduct = {
  id: string; name: string; description: string; category: string; price_label: string | null; image_url: string | null;
  affiliate_url: string; partner: string | null; active: boolean; featured: boolean; sort: number;
};
export type Category = { id: string; kind: "store" | "affiliate"; name: string; slug: string; sort: number };

export const STORE_CURRENCY = "NGN";

/** Price shown to buyers. Free products always read "Free". */
export function formatPrice(minor: number, currency: string, isFree = false): string {
  if (isFree || minor <= 0) return "Free";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(minor / 100);
}

/** Amount a buyer is charged, in minor units (kobo/cents). Free products are never charged. */
export function chargeAmount(p: { price_minor: number; is_free: boolean }): number {
  return p.is_free ? 0 : Math.max(0, Math.round(p.price_minor));
}

export function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function isSafeHttpUrl(u: string): boolean {
  try { const x = new URL(u); return x.protocol === "https:" || x.protocol === "http:"; } catch { return false; }
}

export function formatBytes(n: number | null): string {
  if (!n) return "";
  return n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`;
}
