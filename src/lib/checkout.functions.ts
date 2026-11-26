import { createServerFn } from "@tanstack/react-start";

export const getPaymentOptions = createServerFn({ method: "GET" }).handler(async () => {
  const { configuredProviders } = await import("./payments.server");
  return { providers: configuredProviders() };
});

export const startCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; email: string; provider: "paystack" | "flutterwave"; origin: string }) => {
    const email = String(d.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) throw new Error("Please enter a valid email address.");
    if (d.provider !== "paystack" && d.provider !== "flutterwave") throw new Error("Unknown payment provider.");
    return { productId: String(d.productId), email, provider: d.provider, origin: String(d.origin ?? "") };
  })
  .handler(async ({ data }) => {
    const pay = await import("./payments.server");
    if (!pay.configuredProviders().includes(data.provider)) throw new Error("This payment method is not switched on yet.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: p } = await supabaseAdmin.from("store_products").select("id,title,price_minor,currency,is_free,published,pdf_path").eq("id", data.productId).maybeSingle();
    if (!p || !p.published || !p.pdf_path) throw new Error("This product is not available.");
    const amount = pay.chargeAmount(p);
    if (amount <= 0) throw new Error("This product is free — use the free download button.");
    const reference = `lf-${crypto.randomUUID()}`;
    const { data: order, error } = await supabaseAdmin.from("orders").insert({
      product_id: p.id, email: data.email, amount_minor: amount, currency: p.currency, provider: data.provider, reference,
    }).select("id,download_token").single();
    if (error || !order) throw new Error("Could not create your order. Please try again.");
    const callbackUrl = `${pay.safeOrigin(data.origin)}/store/order/${order.id}?token=${order.download_token}`;
    const url = await pay.initPayment({ provider: data.provider, reference, email: data.email, amountMinor: amount, currency: p.currency, callbackUrl, title: p.title });
    await supabaseAdmin.from("orders").update({ checkout_url: url }).eq("id", order.id);
    return { checkoutUrl: url };
  });

export const getOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { orderId: string; token: string }) => ({ orderId: String(d.orderId), token: String(d.token) }))
  .handler(async ({ data }) => {
    if (!/^[0-9a-f-]{36}$/i.test(data.orderId) || !/^[0-9a-f-]{36}$/i.test(data.token)) return { found: false as const };
    const pay = await import("./payments.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin.from("orders").select("id,reference,status,download_token,amount_minor,currency,email,product_id").eq("id", data.orderId).maybeSingle();
    if (!order || order.download_token !== data.token) return { found: false as const };
    const paid = order.status === "paid" || (await pay.confirmByReference(order.reference));
    const { data: p } = await supabaseAdmin.from("store_products").select("title,slug,pdf_path").eq("id", order.product_id).maybeSingle();
    const downloadUrl = paid && p?.pdf_path ? await pay.signedPdfUrl(p.pdf_path, p.title) : null;
    return { found: true as const, paid, title: p?.title ?? "Your product", slug: p?.slug ?? "", amountMinor: order.amount_minor, currency: order.currency, email: order.email, downloadUrl };
  });

export const getFreeDownload = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string }) => ({ productId: String(d.productId) }))
  .handler(async ({ data }) => {
    const pay = await import("./payments.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: p } = await supabaseAdmin.from("store_products").select("title,is_free,price_minor,published,pdf_path").eq("id", data.productId).maybeSingle();
    if (!p || !p.published || !p.pdf_path || pay.chargeAmount(p) > 0) throw new Error("This download is not available.");
    return { url: await pay.signedPdfUrl(p.pdf_path, p.title) };
  });
