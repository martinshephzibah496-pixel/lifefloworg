export const categories = ["Home Buying", "Mortgage Education", "Renting vs. Buying", "Moving and Relocation", "Personal Budgeting", "First Apartment Living", "Homeownership Costs", "Financial Planning"] as const;
export type Article = { slug: string; title: string; category: (typeof categories)[number]; description: string; date: string; minutes: number; calculators: string[]; sections: { h: string; p: string[] }[] };

export const articles: Article[] = [
  { slug: "how-much-house-can-i-afford", title: "How Much House Can I Afford? A Practical Guide", category: "Home Buying", date: "2026-10-02", minutes: 7,
    description: "Learn how lenders judge affordability, the 28/36 rule, and how to set a home budget that leaves room for life.", calculators: ["mortgage-affordability-calculator", "mortgage-payment-calculator"],
    sections: [
      { h: "Start with your monthly comfort zone", p: ["The price a lender approves is not always the price you should pay. Begin with the monthly payment you can comfortably afford after savings, debts and everyday spending.", "Many households aim to keep total housing costs — mortgage, taxes, insurance and fees — near 25–30% of gross income."] },
      { h: "Understand the 28/36 rule", p: ["A widely used guideline caps housing costs at 28% of gross monthly income and all debt payments at 36%. Lenders in different countries use their own ratios, but the idea is the same: debts should leave space for living costs."] },
      { h: "Don't forget the upfront cash", p: ["Besides the down payment, you will need closing costs, moving costs and an emergency fund. Draining savings to buy can leave you exposed to the first repair bill."] },
      { h: "Next steps", p: ["Run your numbers in the affordability calculator, then test specific homes with the monthly payment calculator. Speak with a licensed lender for a formal pre-approval."] },
    ] },
  { slug: "understanding-mortgage-payments", title: "Understanding Your Mortgage Payment: Principal, Interest, Taxes and Insurance", category: "Mortgage Education", date: "2026-09-18", minutes: 6,
    description: "Break down what makes up a monthly mortgage payment and how rate, term and down payment change it.", calculators: ["mortgage-payment-calculator", "homeownership-cost-calculator"],
    sections: [
      { h: "The four parts of a payment", p: ["Most payments include principal (repaying the loan), interest (the cost of borrowing), property taxes and home insurance. Some also include mortgage insurance or association fees."] },
      { h: "How interest rates change the picture", p: ["A one-point change in interest rate can shift a monthly payment by hundreds. Comparing offers from several lenders is one of the simplest ways to save."] },
      { h: "Shorter vs. longer terms", p: ["A 15-year loan has higher monthly payments but far less total interest. A 30-year loan lowers the monthly cost but you pay more over time."] },
      { h: "Amortisation in plain words", p: ["Early payments are mostly interest. Over time, more of each payment reduces the balance. Extra principal payments early on have the greatest effect."] },
    ] },
  { slug: "rent-vs-buy-how-to-decide", title: "Rent vs. Buy: How to Decide What's Right for You", category: "Renting vs. Buying", date: "2026-09-05", minutes: 8,
    description: "Buying isn't always better. Compare costs, flexibility and timelines to decide whether renting or buying suits your life.", calculators: ["rent-vs-buy-calculator", "mortgage-affordability-calculator"],
    sections: [
      { h: "Time horizon matters most", p: ["Buying and selling a home carries large one-off costs. The longer you stay, the more those costs are spread out — which is why short stays often favour renting."] },
      { h: "Compare total cost, not just monthly cost", p: ["A mortgage payment may look similar to rent, but owners also pay maintenance, taxes, insurance and closing costs. Renters may invest the money they would otherwise put into a down payment."] },
      { h: "Value flexibility", p: ["Renting makes it easier to move for work or family. Owning offers stability and control over your space."] },
      { h: "Run your own numbers", p: ["Use the rent vs. buy calculator with your own rent, local prices and expected stay to see which option costs less."] },
    ] },
  { slug: "how-to-budget-for-a-move", title: "How to Budget for a Move Without Surprises", category: "Moving and Relocation", date: "2026-08-21", minutes: 6,
    description: "A step-by-step moving budget: movers, transport, supplies, deposits and the hidden costs most people forget.", calculators: ["moving-cost-calculator", "emergency-moving-budget-calculator"],
    sections: [
      { h: "List every cost category", p: ["Include labour, truck or transport, packing supplies, storage, travel, deposits, utility connection fees and time off work."] },
      { h: "Get multiple written quotes", p: ["Ask at least three moving companies for written estimates based on an inventory. Check licensing, insurance and reviews from independent sources."] },
      { h: "Add a buffer", p: ["Aim for a 10–15% contingency to cover extra hours, parking, stairs or last-minute supplies."] },
      { h: "Reduce what you move", p: ["Selling or donating items before you move lowers labour and transport costs."] },
    ] },
  { slug: "the-30-percent-rule", title: "The 30% Rule for Housing: Does It Still Work?", category: "Personal Budgeting", date: "2026-08-07", minutes: 5,
    description: "What the 30% housing rule means, when it works, and how to adapt it to your income and city.", calculators: ["housing-budget-calculator", "first-apartment-budget-calculator"],
    sections: [
      { h: "Where the rule comes from", p: ["The 30% guideline suggests spending no more than 30% of income on housing, leaving the rest for needs, savings and goals."] },
      { h: "When it doesn't fit", p: ["In high-cost cities it can be unrealistic, while on higher incomes spending 30% may leave money on the table for saving. Treat it as a starting point."] },
      { h: "Build a full budget", p: ["Track all spending for a month, then decide what share of income housing can take while still saving regularly."] },
    ] },
  { slug: "first-apartment-budget-guide", title: "Your First Apartment Budget: What to Expect", category: "First Apartment Living", date: "2026-07-24", minutes: 6,
    description: "Plan your first apartment costs: upfront deposits, furniture, monthly bills and a starter emergency fund.", calculators: ["first-apartment-budget-calculator", "housing-budget-calculator"],
    sections: [
      { h: "Upfront costs", p: ["Expect first month's rent, a security deposit, possible application fees, utility deposits and basic furniture."] },
      { h: "Monthly costs", p: ["Beyond rent: utilities, internet, groceries, transport, renters insurance, phone and subscriptions."] },
      { h: "Start small with furniture", p: ["Buy the essentials first — bed, basic kitchen items, cleaning supplies — and add the rest over time."] },
      { h: "Use the checklist", p: ["Our first apartment essentials checklist helps you prioritise what you need on day one."] },
    ] },
  { slug: "hidden-costs-of-homeownership", title: "The Hidden Costs of Homeownership", category: "Homeownership Costs", date: "2026-07-10", minutes: 7,
    description: "Maintenance, repairs, taxes and insurance: the costs beyond your mortgage and how to plan for them.", calculators: ["homeownership-cost-calculator", "mortgage-payment-calculator"],
    sections: [
      { h: "Maintenance and repairs", p: ["A common planning rule sets aside 1–3% of the home's value every year for upkeep, appliances and repairs."] },
      { h: "Taxes and insurance can rise", p: ["Property taxes and insurance premiums can increase over time, so review them yearly."] },
      { h: "Utilities and services", p: ["Homes often cost more to heat, cool and maintain than apartments. Factor in water, waste and garden care."] },
      { h: "Build a home fund", p: ["Automate a monthly transfer into a dedicated savings account for home costs."] },
    ] },
  { slug: "closing-costs-explained", title: "Closing Costs Explained for First-Time Buyers", category: "Home Buying", date: "2026-06-26", minutes: 6,
    description: "What closing costs include, typical ranges, and how to prepare — plus what happens if closing is delayed.", calculators: ["closing-cost-calculator", "closing-delay-cost-calculator"],
    sections: [
      { h: "What's included", p: ["Lender fees, appraisal, inspection, title and legal fees, transfer taxes, recording fees and prepaid taxes and insurance."] },
      { h: "Typical ranges", p: ["Closing costs often total 2–6% of the purchase price, varying widely by country and region."] },
      { h: "Plan for delays", p: ["Delays can mean extra lodging, storage and rate lock fees. Keep a buffer and stay in close contact with your lender and agent."] },
    ] },
  { slug: "building-an-emergency-fund", title: "Building an Emergency Fund Before a Big Move", category: "Financial Planning", date: "2026-06-12", minutes: 5,
    description: "Why an emergency fund matters before buying or moving, how much to save and simple ways to build it.", calculators: ["emergency-moving-budget-calculator", "housing-budget-calculator"],
    sections: [
      { h: "How much is enough?", p: ["Many planners suggest three to six months of essential expenses. Homeowners may want more to cover repairs."] },
      { h: "Make saving automatic", p: ["Schedule a transfer on payday so saving happens before spending."] },
      { h: "Keep it accessible", p: ["Hold your emergency fund in a safe, easy-to-reach account rather than investments that can fall in value."] },
    ] },
];
export const getArticle = (s: string) => articles.find((a) => a.slug === s);
