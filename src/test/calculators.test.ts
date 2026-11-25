import { describe, expect, it } from "vitest";
import { monthlyPayment, loanFromPayment, remainingBalance, getCalculator, defaultsOf } from "@/lib/calculators";

describe("mortgage math", () => {
  it("computes a standard 30-year payment", () => {
    expect(monthlyPayment(280000, 6.5, 30)).toBeCloseTo(1769.79, 1);
  });
  it("handles a zero interest rate", () => {
    expect(monthlyPayment(120000, 0, 10)).toBe(1000);
  });
  it("inverts payment back to loan", () => {
    expect(loanFromPayment(monthlyPayment(200000, 5, 30), 5, 30)).toBeCloseTo(200000, 0);
  });
  it("balance is zero at end of term", () => {
    expect(remainingBalance(200000, 5, 30, 360)).toBeCloseTo(0, 0);
  });
  it("every calculator computes with defaults", () => {
    const c = getCalculator("mortgage-payment-calculator");
    expect(c).toBeDefined();
    if (c) expect(c.compute(defaultsOf(c)).primary.value).toBe("2,245");
  });
});
