export type Field = { key: string; label: string; default: number; step?: number; unit?: "money" | "%" | "years" | "days" | "km" | "hours" | "count" | "nights"; help?: string };
export type Row = { label: string; value: string };
export type Result = { primary: Row; rows: Row[]; explanation: string };
export type Calculator = {
  slug: string; title: string; short: string; seoTitle: string; description: string;
  fields: Field[]; compute: (v: Record<string, number>) => Result; disclaimer: string; article?: string;
};

export const money = (n: number) =>
  (Number.isFinite(n) ? Math.round(n) : 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
export const pct = (n: number) => `${(Number.isFinite(n) ? n : 0).toFixed(1)}%`;
const g = (v: Record<string, number>, k: string) => { const x = v[k]; return typeof x === "number" && Number.isFinite(x) ? x : 0; };

/** Monthly principal & interest payment. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number) {
  const n = years * 12; if (principal <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}
/** Loan amount a monthly payment supports. */
export function loanFromPayment(payment: number, annualRatePct: number, years: number) {
  const n = years * 12; if (payment <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return payment * n;
  return (payment * (1 - Math.pow(1 + r, -n))) / r;
}
/** Remaining balance after k monthly payments. */
export function remainingBalance(principal: number, annualRatePct: number, years: number, monthsPaid: number) {
  const r = annualRatePct / 100 / 12; const pmt = monthlyPayment(principal, annualRatePct, years);
  const k = Math.min(monthsPaid, years * 12);
  if (r === 0) return Math.max(0, principal - pmt * k);
  return Math.max(0, principal * Math.pow(1 + r, k) - (pmt * (Math.pow(1 + r, k) - 1)) / r);
}

const D = "Results are estimates for educational purposes only and are not financial, mortgage or legal advice. Actual figures depend on lenders, local taxes, fees and your circumstances.";

export const calculators: Calculator[] = [
  {
    slug: "mortgage-affordability-calculator", title: "Mortgage Affordability Calculator", short: "Estimate how much home your income can support.",
    seoTitle: "Home Affordability Calculator – How Much House Can I Afford?", description: "Free home affordability calculator. Estimate the home price your income, debts and down payment can support using common lending ratios.",
    article: "how-much-house-can-i-afford",
    fields: [
      { key: "income", label: "Annual gross income", default: 85000, unit: "money" },
      { key: "debts", label: "Monthly debt payments (car, cards, loans)", default: 400, unit: "money" },
      { key: "down", label: "Down payment saved", default: 40000, unit: "money" },
      { key: "rate", label: "Interest rate", default: 6.5, step: 0.05, unit: "%" },
      { key: "term", label: "Loan term", default: 30, unit: "years" },
      { key: "taxIns", label: "Est. monthly property tax + insurance", default: 450, unit: "money" },
    ],
    compute: (v) => {
      const mi = g(v, "income") / 12;
      const housingCap = mi * 0.28, totalCap = mi * 0.36 - g(v, "debts");
      const allowed = Math.max(0, Math.min(housingCap, totalCap));
      const pi = Math.max(0, allowed - g(v, "taxIns"));
      const loan = loanFromPayment(pi, g(v, "rate"), g(v, "term"));
      const price = loan + g(v, "down");
      return {
        primary: { label: "Estimated affordable home price", value: money(price) },
        rows: [
          { label: "Max total monthly housing payment", value: money(allowed) },
          { label: "Principal & interest portion", value: money(pi) },
          { label: "Estimated loan amount", value: money(loan) },
          { label: "Down payment", value: money(g(v, "down")) },
        ],
        explanation: `Lenders commonly cap housing costs at about 28% of gross monthly income and total debt at about 36%. Using the lower of those limits, you could spend roughly ${money(allowed)} per month on housing, which supports a loan of about ${money(loan)}.`,
      };
    }, disclaimer: D,
  },
  {
    slug: "mortgage-payment-calculator", title: "Monthly Mortgage Payment Calculator", short: "See your full monthly payment, including taxes and insurance.",
    seoTitle: "Mortgage Payment Calculator – Estimate Your Monthly Payment", description: "Calculate your monthly mortgage payment including principal, interest, property tax, insurance and HOA fees.",
    article: "understanding-mortgage-payments",
    fields: [
      { key: "price", label: "Home price", default: 350000, unit: "money" },
      { key: "down", label: "Down payment", default: 70000, unit: "money" },
      { key: "rate", label: "Interest rate", default: 6.5, step: 0.05, unit: "%" },
      { key: "term", label: "Loan term", default: 30, unit: "years" },
      { key: "tax", label: "Annual property tax", default: 4200, unit: "money" },
      { key: "ins", label: "Annual home insurance", default: 1500, unit: "money" },
      { key: "hoa", label: "Monthly HOA / service fees", default: 0, unit: "money" },
    ],
    compute: (v) => {
      const loan = Math.max(0, g(v, "price") - g(v, "down"));
      const pi = monthlyPayment(loan, g(v, "rate"), g(v, "term"));
      const tax = g(v, "tax") / 12, ins = g(v, "ins") / 12, hoa = g(v, "hoa");
      const total = pi + tax + ins + hoa;
      const interest = pi * g(v, "term") * 12 - loan;
      return {
        primary: { label: "Estimated monthly payment", value: money(total) },
        rows: [
          { label: "Principal & interest", value: money(pi) },
          { label: "Property tax", value: money(tax) },
          { label: "Home insurance", value: money(ins) },
          { label: "HOA / fees", value: money(hoa) },
          { label: "Loan amount", value: money(loan) },
          { label: "Total interest over loan life", value: money(Math.max(0, interest)) },
        ],
        explanation: `On a ${money(loan)} loan at ${g(v, "rate")}% over ${g(v, "term")} years, principal and interest are about ${money(pi)} per month. Taxes, insurance and fees bring the total to about ${money(total)}. Some loans also require mortgage insurance when the down payment is small.`,
      };
    }, disclaimer: D,
  },
  {
    slug: "rent-vs-buy-calculator", title: "Rent vs. Buy Calculator", short: "Compare the true cost of renting and buying over time.",
    seoTitle: "Rent vs Buy Calculator – Should I Rent or Buy a Home?", description: "Compare the long-term cost of renting versus buying a home, including appreciation, ownership costs, closing and selling costs.",
    article: "rent-vs-buy-how-to-decide",
    fields: [
      { key: "rent", label: "Current monthly rent", default: 1800, unit: "money" },
      { key: "rentInc", label: "Annual rent increase", default: 3, step: 0.1, unit: "%" },
      { key: "price", label: "Home price", default: 350000, unit: "money" },
      { key: "downPct", label: "Down payment", default: 20, unit: "%" },
      { key: "rate", label: "Mortgage rate", default: 6.5, step: 0.05, unit: "%" },
      { key: "years", label: "Years you plan to stay", default: 7, unit: "years" },
      { key: "appr", label: "Annual home appreciation", default: 3, step: 0.1, unit: "%" },
      { key: "own", label: "Yearly ownership costs (tax, insurance, upkeep) as % of value", default: 2.5, step: 0.1, unit: "%" },
      { key: "buyCost", label: "Buying closing costs", default: 3, step: 0.1, unit: "%" },
      { key: "sellCost", label: "Selling costs", default: 6, step: 0.1, unit: "%" },
    ],
    compute: (v) => {
      const yrs = Math.max(1, Math.round(g(v, "years")));
      let rentTotal = 0, rent = g(v, "rent");
      for (let y = 0; y < yrs; y++) { rentTotal += rent * 12; rent *= 1 + g(v, "rentInc") / 100; }
      const price = g(v, "price"); const down = price * g(v, "downPct") / 100; const loan = price - down;
      const pmt = monthlyPayment(loan, g(v, "rate"), 30);
      let ownCosts = 0, value = price;
      for (let y = 0; y < yrs; y++) { ownCosts += value * g(v, "own") / 100; value *= 1 + g(v, "appr") / 100; }
      const balance = remainingBalance(loan, g(v, "rate"), 30, yrs * 12);
      const equityOut = value * (1 - g(v, "sellCost") / 100) - balance;
      const buyTotal = down + price * g(v, "buyCost") / 100 + pmt * 12 * yrs + ownCosts - equityOut;
      const diff = rentTotal - buyTotal;
      return {
        primary: { label: diff >= 0 ? "Buying could save you" : "Renting could save you", value: money(Math.abs(diff)) },
        rows: [
          { label: `Total rent over ${yrs} years`, value: money(rentTotal) },
          { label: `Net cost of buying over ${yrs} years`, value: money(buyTotal) },
          { label: "Monthly principal & interest (30-yr)", value: money(pmt) },
          { label: "Estimated home value at sale", value: money(value) },
          { label: "Equity after selling costs", value: money(equityOut) },
        ],
        explanation: `Net cost of buying includes the down payment, closing costs, mortgage payments and ownership costs, minus what you would keep after selling. It does not include investment returns you might earn on the down payment if you rented instead. Shorter stays usually favour renting because buying and selling costs are spread over fewer years.`,
      };
    }, disclaimer: D,
  },
  {
    slug: "closing-cost-calculator", title: "Home Buying Closing Cost Calculator", short: "Estimate the cash you need at closing.",
    seoTitle: "Closing Costs Calculator – Estimate Home Buying Closing Costs", description: "Estimate home buying closing costs including lender fees, title, appraisal, prepaid items and transfer taxes, plus total cash to close.",
    article: "closing-costs-explained",
    fields: [
      { key: "price", label: "Home price", default: 350000, unit: "money" },
      { key: "down", label: "Down payment", default: 35000, unit: "money" },
      { key: "lender", label: "Lender / origination fees (% of loan)", default: 1, step: 0.1, unit: "%" },
      { key: "title", label: "Title, escrow & legal fees", default: 2000, unit: "money" },
      { key: "inspect", label: "Appraisal & inspection", default: 900, unit: "money" },
      { key: "prepaid", label: "Prepaid taxes, insurance & interest", default: 3000, unit: "money" },
      { key: "transfer", label: "Transfer / stamp taxes (% of price)", default: 0.5, step: 0.1, unit: "%" },
      { key: "other", label: "Other fees (recording, survey, etc.)", default: 500, unit: "money" },
    ],
    compute: (v) => {
      const loan = Math.max(0, g(v, "price") - g(v, "down"));
      const lender = loan * g(v, "lender") / 100, transfer = g(v, "price") * g(v, "transfer") / 100;
      const total = lender + transfer + g(v, "title") + g(v, "inspect") + g(v, "prepaid") + g(v, "other");
      return {
        primary: { label: "Estimated closing costs", value: money(total) },
        rows: [
          { label: "Lender fees", value: money(lender) },
          { label: "Transfer taxes", value: money(transfer) },
          { label: "Closing costs as % of price", value: pct(g(v, "price") ? total / g(v, "price") * 100 : 0) },
          { label: "Total cash to close (incl. down payment)", value: money(total + g(v, "down")) },
        ],
        explanation: `Closing costs often fall between 2% and 6% of the purchase price depending on location and loan type. Ask your lender for an official loan estimate to compare offers line by line.`,
      };
    }, disclaimer: D,
  },
  {
    slug: "moving-cost-calculator", title: "Moving Cost Calculator", short: "Budget for movers, transport, supplies and travel.",
    seoTitle: "Moving Cost Calculator – Estimate the Cost of Your Move", description: "Estimate moving costs including movers, truck, distance, packing supplies, storage and travel expenses.",
    article: "how-to-budget-for-a-move",
    fields: [
      { key: "movers", label: "Number of movers", default: 3, unit: "count" },
      { key: "hourly", label: "Hourly rate per mover", default: 40, unit: "money" },
      { key: "hours", label: "Estimated hours", default: 6, unit: "hours" },
      { key: "distance", label: "Distance", default: 150, unit: "km" },
      { key: "perKm", label: "Truck / transport cost per km", default: 1.5, step: 0.1, unit: "money" },
      { key: "supplies", label: "Packing supplies", default: 200, unit: "money" },
      { key: "storage", label: "Storage", default: 0, unit: "money" },
      { key: "travel", label: "Travel, meals & lodging", default: 150, unit: "money" },
      { key: "buffer", label: "Contingency buffer", default: 10, unit: "%" },
    ],
    compute: (v) => {
      const labour = g(v, "movers") * g(v, "hourly") * g(v, "hours");
      const transport = g(v, "distance") * g(v, "perKm");
      const sub = labour + transport + g(v, "supplies") + g(v, "storage") + g(v, "travel");
      const buf = sub * g(v, "buffer") / 100;
      return {
        primary: { label: "Estimated moving cost", value: money(sub + buf) },
        rows: [
          { label: "Labour", value: money(labour) },
          { label: "Transport", value: money(transport) },
          { label: "Supplies, storage & travel", value: money(g(v, "supplies") + g(v, "storage") + g(v, "travel")) },
          { label: "Contingency", value: money(buf) },
        ],
        explanation: `Labour and transport are usually the largest moving costs. A contingency buffer covers surprises like extra hours, stairs or parking fees. Get at least three written quotes before booking.`,
      };
    }, disclaimer: D,
  },
  {
    slug: "homeownership-cost-calculator", title: "Homeownership Cost Calculator", short: "Reveal the full monthly cost of owning a home.",
    seoTitle: "Homeownership Cost Calculator – True Cost of Owning a Home", description: "Calculate the true monthly and yearly cost of owning a home including mortgage, taxes, insurance, maintenance, HOA and utilities.",
    article: "hidden-costs-of-homeownership",
    fields: [
      { key: "value", label: "Home value", default: 350000, unit: "money" },
      { key: "mortgage", label: "Monthly mortgage (principal & interest)", default: 1770, unit: "money" },
      { key: "taxPct", label: "Property tax rate (yearly)", default: 1.1, step: 0.05, unit: "%" },
      { key: "ins", label: "Annual home insurance", default: 1500, unit: "money" },
      { key: "maint", label: "Maintenance & repairs (yearly % of value)", default: 1, step: 0.1, unit: "%" },
      { key: "hoa", label: "Monthly HOA / service fees", default: 0, unit: "money" },
      { key: "util", label: "Monthly utilities", default: 300, unit: "money" },
    ],
    compute: (v) => {
      const tax = g(v, "value") * g(v, "taxPct") / 100 / 12, ins = g(v, "ins") / 12, maint = g(v, "value") * g(v, "maint") / 100 / 12;
      const total = g(v, "mortgage") + tax + ins + maint + g(v, "hoa") + g(v, "util");
      return {
        primary: { label: "Total monthly cost of ownership", value: money(total) },
        rows: [
          { label: "Mortgage", value: money(g(v, "mortgage")) },
          { label: "Property tax", value: money(tax) },
          { label: "Insurance", value: money(ins) },
          { label: "Maintenance reserve", value: money(maint) },
          { label: "HOA + utilities", value: money(g(v, "hoa") + g(v, "util")) },
          { label: "Yearly total", value: money(total * 12) },
        ],
        explanation: `Beyond the mortgage, owners pay about ${money(total - g(v, "mortgage"))} per month in other costs. A common rule is to set aside 1–3% of the home's value each year for maintenance.`,
      };
    }, disclaimer: D,
  },
  {
    slug: "housing-budget-calculator", title: "Monthly Housing Budget Calculator", short: "Check whether your housing costs fit your income.",
    seoTitle: "Monthly Housing Budget Calculator – How Much Should I Spend on Housing?", description: "Find out how much of your income should go to housing and whether your current rent or mortgage fits your budget.",
    article: "the-30-percent-rule",
    fields: [
      { key: "income", label: "Monthly take-home income", default: 4500, unit: "money" },
      { key: "target", label: "Target share of income for housing", default: 30, unit: "%" },
      { key: "housing", label: "Rent or mortgage payment", default: 1500, unit: "money" },
      { key: "util", label: "Utilities & internet", default: 220, unit: "money" },
      { key: "ins", label: "Renters / home insurance", default: 25, unit: "money" },
    ],
    compute: (v) => {
      const cap = g(v, "income") * g(v, "target") / 100;
      const cur = g(v, "housing") + g(v, "util") + g(v, "ins");
      const share = g(v, "income") ? cur / g(v, "income") * 100 : 0;
      const diff = cap - cur;
      return {
        primary: { label: "Recommended maximum housing budget", value: money(cap) },
        rows: [
          { label: "Your current housing costs", value: money(cur) },
          { label: "Share of income", value: pct(share) },
          { label: diff >= 0 ? "Room left in budget" : "Over budget by", value: money(Math.abs(diff)) },
        ],
        explanation: diff >= 0 ? `Your housing costs use ${pct(share)} of take-home income, within your ${g(v, "target")}% target.` : `Your housing costs use ${pct(share)} of take-home income, above your ${g(v, "target")}% target. Consider lowering costs or increasing income to leave room for savings.`,
      };
    }, disclaimer: D,
  },
  {
    slug: "first-apartment-budget-calculator", title: "First Apartment Budget Calculator", short: "Plan monthly costs and upfront cash for your first place.",
    seoTitle: "First Apartment Budget Calculator – Plan Your First Place", description: "Plan your first apartment budget: monthly rent, bills and living costs plus the upfront cash needed for deposit and furniture.",
    article: "first-apartment-budget-guide",
    fields: [
      { key: "income", label: "Monthly take-home income", default: 3200, unit: "money" },
      { key: "rent", label: "Monthly rent", default: 1100, unit: "money" },
      { key: "util", label: "Utilities & internet", default: 180, unit: "money" },
      { key: "food", label: "Groceries", default: 350, unit: "money" },
      { key: "transport", label: "Transport", default: 200, unit: "money" },
      { key: "ins", label: "Renters insurance", default: 15, unit: "money" },
      { key: "other", label: "Phone, subscriptions & other", default: 200, unit: "money" },
      { key: "depositMonths", label: "Security deposit (months of rent)", default: 1, unit: "count" },
      { key: "furniture", label: "Furniture & essentials", default: 1200, unit: "money" },
    ],
    compute: (v) => {
      const monthly = g(v, "rent") + g(v, "util") + g(v, "food") + g(v, "transport") + g(v, "ins") + g(v, "other");
      const left = g(v, "income") - monthly;
      const upfront = g(v, "rent") * (1 + g(v, "depositMonths")) + g(v, "furniture");
      return {
        primary: { label: "Left over each month", value: money(left) },
        rows: [
          { label: "Total monthly costs", value: money(monthly) },
          { label: "Rent as % of income", value: pct(g(v, "income") ? g(v, "rent") / g(v, "income") * 100 : 0) },
          { label: "Upfront cash needed (first month + deposit + furniture)", value: money(upfront) },
        ],
        explanation: left >= 0 ? `You would have about ${money(left)} left monthly for savings and surprises. Aim to save at least 3 months of expenses as an emergency fund.` : `Your costs exceed income by ${money(-left)} per month. Look for lower rent, a roommate or cheaper essentials before signing a lease.`,
      };
    }, disclaimer: D,
  },
  {
    slug: "emergency-moving-budget-calculator", title: "Emergency Moving Budget Calculator", short: "Plan fast when you need to move on short notice.",
    seoTitle: "Emergency Moving Budget Calculator – Plan a Last-Minute Move", description: "Estimate the cash you need for an urgent move, including deposit, first rent, temporary lodging and transport, plus daily savings needed.",
    article: "how-to-budget-for-a-move",
    fields: [
      { key: "days", label: "Days until you must move", default: 21, unit: "days" },
      { key: "deposit", label: "Security deposit", default: 1200, unit: "money" },
      { key: "rent", label: "First month's rent", default: 1200, unit: "money" },
      { key: "moving", label: "Movers / truck rental", default: 500, unit: "money" },
      { key: "nights", label: "Nights of temporary lodging", default: 3, unit: "nights" },
      { key: "nightly", label: "Lodging cost per night", default: 90, unit: "money" },
      { key: "saved", label: "Money already available", default: 1000, unit: "money" },
      { key: "buffer", label: "Contingency buffer", default: 15, unit: "%" },
    ],
    compute: (v) => {
      const sub = g(v, "deposit") + g(v, "rent") + g(v, "moving") + g(v, "nights") * g(v, "nightly");
      const total = sub * (1 + g(v, "buffer") / 100);
      const gap = Math.max(0, total - g(v, "saved"));
      const daily = g(v, "days") > 0 ? gap / g(v, "days") : gap;
      return {
        primary: { label: "Emergency moving budget", value: money(total) },
        rows: [
          { label: "Housing (deposit + rent)", value: money(g(v, "deposit") + g(v, "rent")) },
          { label: "Moving + lodging", value: money(g(v, "moving") + g(v, "nights") * g(v, "nightly")) },
          { label: "Still needed", value: money(gap) },
          { label: "Save per day to cover the gap", value: money(daily) },
        ],
        explanation: gap > 0 ? `You need about ${money(gap)} more, or roughly ${money(daily)} per day over ${g(v, "days")} days. Prioritise deposit and first rent, and ask landlords whether payments can be split.` : `Your available funds cover the estimated budget. Keep the buffer for unexpected costs.`,
      };
    }, disclaimer: D + " If you are facing an unsafe housing situation, contact local emergency or housing support services.",
  },
  {
    slug: "closing-delay-cost-calculator", title: "Closing Delay Cost Calculator", short: "Estimate what a delayed closing could cost you.",
    seoTitle: "Closing Delay Cost Calculator – Cost of a Delayed Home Closing", description: "Estimate the extra costs of a delayed home closing including temporary housing, storage, meals and rate lock extension fees.",
    article: "closing-costs-explained",
    fields: [
      { key: "days", label: "Days of delay", default: 10, unit: "days" },
      { key: "lodging", label: "Temporary housing per day", default: 100, unit: "money" },
      { key: "storage", label: "Storage per day", default: 15, unit: "money" },
      { key: "meals", label: "Extra meals & transport per day", default: 30, unit: "money" },
      { key: "loan", label: "Loan amount", default: 300000, unit: "money" },
      { key: "lockPct", label: "Rate lock extension fee (% of loan)", default: 0.25, step: 0.05, unit: "%" },
      { key: "other", label: "Other one-off costs (re-booking movers, etc.)", default: 200, unit: "money" },
    ],
    compute: (v) => {
      const daily = g(v, "lodging") + g(v, "storage") + g(v, "meals");
      const lock = g(v, "loan") * g(v, "lockPct") / 100;
      const total = daily * g(v, "days") + lock + g(v, "other");
      return {
        primary: { label: "Estimated cost of delay", value: money(total) },
        rows: [
          { label: "Daily living costs", value: money(daily) },
          { label: `Living costs over ${g(v, "days")} days`, value: money(daily * g(v, "days")) },
          { label: "Rate lock extension", value: money(lock) },
          { label: "Other costs", value: money(g(v, "other")) },
        ],
        explanation: `Each day of delay costs about ${money(daily)} in living expenses. Check your purchase contract — some include per-day compensation if the other party causes the delay.`,
      };
    }, disclaimer: D,
  },
];

export const getCalculator = (slug: string) => calculators.find((c) => c.slug === slug);
export const defaultsOf = (c: Calculator) => Object.fromEntries(c.fields.map((f) => [f.key, f.default])) as Record<string, number>;
