import { describe, expect, it } from "vitest";
import { chargeAmount, formatPrice, isSafeHttpUrl } from "@/lib/store";

describe("store rules", () => {
  it("never charges for a free product even if a price is set", () => {
    expect(chargeAmount({ price_minor: 500000, is_free: true })).toBe(0);
  });
  it("charges the stored price in kobo for paid products", () => {
    expect(chargeAmount({ price_minor: 250000, is_free: false })).toBe(250000);
  });
  it("shows Free for free products", () => {
    expect(formatPrice(250000, "NGN", true)).toBe("Free");
  });
  it("affiliate links must be http(s)", () => {
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("https://partner.example/?ref=lifeflow")).toBe(true);
  });
});
