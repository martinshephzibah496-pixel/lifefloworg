export type Planner = { slug: string; title: string; description: string; kind: "checklist" | "budget" | "timeline" | "assessment"; groups?: { h: string; items: string[] }[]; rows?: string[] };

export const planners: Planner[] = [
  { slug: "first-time-homebuyer-checklist", title: "First-Time Homebuyer Checklist", kind: "checklist", description: "Every step from saving to getting the keys, in order.", groups: [
    { h: "Get ready", items: ["Check your credit report and fix errors", "Set a monthly housing budget", "Save for down payment and closing costs", "Build an emergency fund"] },
    { h: "Finance", items: ["Compare at least three lenders", "Get pre-approved for a mortgage", "Understand your loan estimate"] },
    { h: "Find a home", items: ["List must-haves vs. nice-to-haves", "Research neighbourhoods", "Make an offer", "Book a professional home inspection"] },
    { h: "Close", items: ["Arrange home insurance", "Review closing documents", "Do a final walk-through", "Collect keys and change locks"] },
  ] },
  { slug: "home-buying-preparation-checklist", title: "Home Buying Preparation Checklist", kind: "checklist", description: "Documents and finances to organise before you apply.", groups: [
    { h: "Documents", items: ["Proof of identity", "Recent pay slips", "Tax returns / income statements", "Bank statements (2–3 months)", "List of debts and monthly payments"] },
    { h: "Finances", items: ["Pay down high-interest debt", "Avoid new credit applications", "Keep large deposits documented", "Calculate cash needed to close"] },
  ] },
  { slug: "first-apartment-essentials-checklist", title: "First Apartment Essentials Checklist", kind: "checklist", description: "What you really need on day one — and what can wait.", groups: [
    { h: "Day one", items: ["Bed and bedding", "Towels and toiletries", "Basic cookware and utensils", "Cleaning supplies", "Phone charger and extension cord", "First-aid kit"] },
    { h: "First month", items: ["Sofa or seating", "Table and chairs", "Lamps", "Storage boxes", "Tool kit"] },
    { h: "Admin", items: ["Set up utilities and internet", "Get renters insurance", "Update your address", "Photograph the apartment's condition"] },
  ] },
  { slug: "moving-budget-planner", title: "Moving Budget Planner", kind: "budget", description: "Set a moving budget and track each expense against it.", rows: ["Movers / labour", "Truck or transport", "Packing supplies", "Storage", "Travel & lodging", "Deposits", "Utility setup fees"] },
  { slug: "monthly-housing-expense-tracker", title: "Monthly Housing Expense Tracker", kind: "budget", description: "Track rent or mortgage and every household bill each month.", rows: ["Rent / mortgage", "Electricity", "Water", "Gas / heating", "Internet", "Insurance", "Maintenance"] },
  { slug: "moving-timeline-planner", title: "Moving Timeline Planner", kind: "timeline", description: "Enter your moving date to get a dated week-by-week plan." },
  { slug: "homeownership-readiness-assessment", title: "Homeownership Readiness Assessment", kind: "assessment", description: "Answer 8 quick questions to see how ready you are to buy." },
];
export const getPlanner = (s: string) => planners.find((p) => p.slug === s);

export const timelineTasks: { weeks: number; task: string }[] = [
  { weeks: 8, task: "Set your moving budget and research movers" },
  { weeks: 6, task: "Book movers or a truck; start decluttering" },
  { weeks: 4, task: "Collect packing supplies; notify landlord or schedule closing" },
  { weeks: 3, task: "Arrange utilities and internet at the new home" },
  { weeks: 2, task: "Update your address with banks, employer and services" },
  { weeks: 1, task: "Pack non-essentials; confirm movers and timings" },
  { weeks: 0, task: "Moving day: final walk-through and meter readings" },
  { weeks: -1, task: "Unpack essentials, check for damage and file claims" },
];

export const assessment: { q: string; options: [string, number][] }[] = [
  { q: "Do you have stable income you expect to continue?", options: [["Yes, very stable", 2], ["Mostly", 1], ["Not yet", 0]] },
  { q: "How much have you saved toward a down payment?", options: [["10% or more of target price", 2], ["Some savings", 1], ["Little or none", 0]] },
  { q: "Do you have an emergency fund of 3+ months?", options: [["Yes", 2], ["1–3 months", 1], ["No", 0]] },
  { q: "How are your existing debts?", options: [["Low / none", 2], ["Manageable", 1], ["High", 0]] },
  { q: "Do you know your credit standing?", options: [["Yes, it's good", 2], ["Unsure", 1], ["It needs work", 0]] },
  { q: "How long do you plan to stay in one area?", options: [["5+ years", 2], ["2–5 years", 1], ["Under 2 years", 0]] },
  { q: "Have you budgeted for maintenance, taxes and insurance?", options: [["Yes", 2], ["Roughly", 1], ["No", 0]] },
  { q: "Would a mortgage payment fit within ~30% of income?", options: [["Yes", 2], ["Close", 1], ["No", 0]] },
];
