import { createServerFn } from "@tanstack/react-start";
import type { AffiliateProduct, Category, PublicProduct } from "./store";

const PRODUCT_COLS = "id,slug,title,summary,description,category,price_minor,currency,is_free,cover_url,pdf_path,file_size_bytes,page_count,download_info,published,featured,created_at,updated_at";

function toPublic(r: Record<string, unknown>): PublicProduct {
  const { pdf_path, ...rest } = r as { pdf_path: string | null } & PublicProduct;
  return { ...rest, has_file: !!pdf_path };
}

export const listStoreProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("./public-client.server");
  const { data, error } = await publicClient().from("store_products").select(PRODUCT_COLS).eq("published", true)
    .order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toPublic);
});

export const getStoreProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => ({ slug: String(d.slug).slice(0, 120) }))
  .handler(async ({ data }) => {
    const { publicClient } = await import("./public-client.server");
    const { data: row, error } = await publicClient().from("store_products").select(PRODUCT_COLS)
      .eq("published", true).eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    return row ? toPublic(row) : null;
  });

export const listAffiliates = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("./public-client.server");
  const { data, error } = await publicClient().from("affiliate_products")
    .select("id,name,description,category,price_label,image_url,affiliate_url,partner,active,featured,sort")
    .eq("active", true).order("featured", { ascending: false }).order("sort").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as AffiliateProduct[];
});

export const listCategories = createServerFn({ method: "GET" })
  .inputValidator((d: { kind: "store" | "affiliate" }) => ({ kind: d.kind === "affiliate" ? "affiliate" : "store" }))
  .handler(async ({ data }) => {
    const { publicClient } = await import("./public-client.server");
    const { data: rows, error } = await publicClient().from("categories").select("id,kind,name,slug,sort").eq("kind", data.kind).order("sort");
    if (error) throw new Error(error.message);
    return (rows ?? []) as Category[];
  });
