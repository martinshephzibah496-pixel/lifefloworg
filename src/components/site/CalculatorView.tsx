import { useMemo, useState } from "react";
import { RotateCcw, Info } from "lucide-react";
import { type Calculator, defaultsOf } from "@/lib/calculators";

const unitLabel: Record<string, string> = { "%": "%", years: "yrs", days: "days", km: "km", hours: "hrs", count: "", nights: "nights", money: "" };

export function CalculatorView({ calc }: { calc: Calculator }) {
  const [raw, setRaw] = useState<Record<string, string>>(() => Object.fromEntries(calc.fields.map((f) => [f.key, String(f.default)])));
  const errors: Record<string, string> = {};
  const values = useMemo(() => {
    const out = defaultsOf(calc);
    for (const f of calc.fields) out[f.key] = Number(raw[f.key] ?? "");
    return out;
  }, [raw, calc]);
  for (const f of calc.fields) {
    const s = raw[f.key] ?? "";
    const n = Number(s);
    if (s.trim() === "" || !Number.isFinite(n)) errors[f.key] = "Enter a number.";
    else if (n < 0) errors[f.key] = "Value can't be negative.";
  }
  const valid = Object.keys(errors).length === 0;
  const result = valid ? calc.compute(values) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form className="rounded-2xl border bg-card p-5 md:p-7" onSubmit={(e) => e.preventDefault()} aria-label={`${calc.title} inputs`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Your numbers</h2>
          <button type="button" onClick={() => setRaw(Object.fromEntries(calc.fields.map((f) => [f.key, String(f.default)])))} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-muted">
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {calc.fields.map((f) => {
            const id = `${calc.slug}-${f.key}`; const err = errors[f.key];
            return (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label htmlFor={id} className="text-sm font-medium">{f.label}</label>
                <div className={`flex h-11 items-center rounded-xl border bg-background px-3 focus-within:ring-2 focus-within:ring-ring ${err ? "border-destructive" : ""}`}>
                  <input id={id} inputMode="decimal" type="number" step={f.step ?? (f.unit === "money" ? 50 : 1)} min={0} value={raw[f.key] ?? ""}
                    onChange={(e) => setRaw((r) => ({ ...r, [f.key]: e.target.value }))} aria-invalid={!!err} aria-describedby={err ? `${id}-e` : undefined}
                    className="w-full bg-transparent text-base outline-none" />
                  <span className="text-sm text-muted-foreground">{unitLabel[f.unit ?? ""]}</span>
                </div>
                {err && <p id={`${id}-e`} className="text-xs text-destructive">{err}</p>}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Amounts work in any currency — just keep them consistent.</p>
      </form>
      <section className="flex flex-col gap-4" aria-live="polite" aria-label="Results">
        <div className="rounded-2xl bg-hero p-6 text-ink-foreground shadow-soft md:p-8">
          {result ? (<>
            <p className="text-sm text-ink-foreground/75">{result.primary.label}</p>
            <p className="mt-1 font-display text-5xl font-semibold">{result.primary.value}</p>
            <dl className="mt-6 divide-y divide-ink-foreground/15">
              {result.rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-4 py-2.5 text-sm"><dt className="text-ink-foreground/80">{r.label}</dt><dd className="font-semibold">{r.value}</dd></div>
              ))}
            </dl>
          </>) : <p>Please fix the highlighted fields to see your results.</p>}
        </div>
        {result && <div className="rounded-2xl border bg-card p-5"><h3 className="font-semibold">What this means</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.explanation}</p></div>}
        <p className="flex gap-2 rounded-xl bg-muted p-4 text-xs text-muted-foreground"><Info className="h-4 w-4 shrink-0" aria-hidden />{calc.disclaimer}</p>
      </section>
    </div>
  );
}
