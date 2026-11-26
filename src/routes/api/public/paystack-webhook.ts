import { createFileRoute } from "@tanstack/react-router";

// Paystack signs webhooks with HMAC-SHA512 of the raw body using the secret key.
export const Route = createFileRoute("/api/public/paystack-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["PAYSTACK_SECRET_KEY"];
        if (!secret) return new Response("not configured", { status: 503 });
        const raw = await request.text();
        const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
        const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
        const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
        if (hex !== request.headers.get("x-paystack-signature")) return new Response("bad signature", { status: 401 });
        try {
          const { event, data } = JSON.parse(raw);
          if (event === "charge.success" && typeof data?.reference === "string") {
            const { confirmByReference } = await import("@/lib/payments.server");
            await confirmByReference(data.reference); // re-verifies with Paystack's API
          }
        } catch { /* ignore malformed */ }
        return new Response("ok");
      },
    },
  },
});
