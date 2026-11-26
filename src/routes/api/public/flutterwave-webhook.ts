import { createFileRoute } from "@tanstack/react-router";

// Flutterwave sends the "secret hash" you set in its dashboard in the verif-hash header.
export const Route = createFileRoute("/api/public/flutterwave-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const hash = process.env["FLUTTERWAVE_WEBHOOK_HASH"];
        if (!hash || !process.env["FLUTTERWAVE_SECRET_KEY"]) return new Response("not configured", { status: 503 });
        if (request.headers.get("verif-hash") !== hash) return new Response("bad signature", { status: 401 });
        try {
          const body = await request.json();
          const ref = body?.data?.tx_ref;
          if (typeof ref === "string") {
            const { confirmByReference } = await import("@/lib/payments.server");
            await confirmByReference(ref); // re-verifies with Flutterwave's API
          }
        } catch { /* ignore */ }
        return new Response("ok");
      },
    },
  },
});
