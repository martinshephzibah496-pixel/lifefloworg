import { useEffect, useState } from "react";
import { Printer, Plus, Trash2, RotateCcw } from "lucide-react";
import { type Planner, timelineTasks, assessment } from "@/lib/planners";
import { money } from "@/lib/calculators";

function usePersisted<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setV(JSON.parse(s) as T); } catch { /* ignore */ } setLoaded(true); }, [key]);
  useEffect(() => { if (loaded) localStorage.setItem(key, JSON.stringify(v)); }, [key, v, loaded]);
  return [v, setV] as const;
}

const btn = "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-muted";

function Toolbar({ onReset }: { onReset: () => void }) {
  return (
    <div className="no-print flex flex-wrap gap-2">
      <button type="button" className={btn} onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden />Print / save as PDF</button>
      <button type="button" className={btn} onClick={onReset}><RotateCcw className="h-4 w-4" aria-hidden />Reset</button>
    </div>
  );
}

function Checklist({ p }: { p: Planner }) {
  const [done, setDone] = usePersisted<Record<string, boolean>>(`lf-${p.slug}`, {});
  const all = p.groups?.flatMap((g) => g.items) ?? [];
  const count = all.filter((i) => done[i]).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold">{count} of {all.length} complete</p><Toolbar onReset={() => setDone({})} />
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${all.length ? (count / all.length) * 100 : 0}%` }} /></div>
      {p.groups?.map((g) => (
        <fieldset key={g.h} className="rounded-2xl border bg-card p-5">
          <legend className="px-1 font-display text-lg font-semibold">{g.h}</legend>
          <ul className="mt-2 space-y-1">
            {g.items.map((i) => (
              <li key={i}><label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-primary" checked={!!done[i]} onChange={(e) => setDone({ ...done, [i]: e.target.checked })} />
                <span className={done[i] ? "text-muted-foreground line-through" : ""}>{i}</span>
              </label></li>
            ))}
          </ul>
        </fieldset>
      ))}
    </div>
  );
}

type BRow = { id: number; name: string; planned: string; actual: string };
function Budget({ p }: { p: Planner }) {
  const init = (p.rows ?? []).map((name, id) => ({ id, name, planned: "", actual: "" }));
  const [rows, setRows] = usePersisted<BRow[]>(`lf-${p.slug}`, init);
  const sum = (k: "planned" | "actual") => rows.reduce((s, r) => s + (Number(r[k]) || 0), 0);
  const upd = (id: number, k: keyof BRow, val: string) => setRows(rows.map((r) => (r.id === id ? { ...r, [k]: val } : r)));
  const diff = sum("planned") - sum("actual");
  const input = "h-10 w-full rounded-lg border bg-background px-2";
  return (
    <div className="space-y-5">
      <div className="flex justify-end"><Toolbar onReset={() => setRows(init)} /></div>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Expense</th><th className="p-3">Planned</th><th className="p-3">Actual</th><th className="p-3"><span className="sr-only">Remove</span></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2"><input aria-label="Expense name" className={input} value={r.name} onChange={(e) => upd(r.id, "name", e.target.value)} /></td>
                <td className="p-2"><input aria-label={`Planned for ${r.name}`} type="number" min={0} className={input} value={r.planned} onChange={(e) => upd(r.id, "planned", e.target.value)} /></td>
                <td className="p-2"><input aria-label={`Actual for ${r.name}`} type="number" min={0} className={input} value={r.actual} onChange={(e) => upd(r.id, "actual", e.target.value)} /></td>
                <td className="p-2"><button type="button" aria-label={`Remove ${r.name}`} className="rounded-lg p-2 hover:bg-muted" onClick={() => setRows(rows.filter((x) => x.id !== r.id))}><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t font-semibold"><tr><td className="p-3">Total</td><td className="p-3">{money(sum("planned"))}</td><td className="p-3">{money(sum("actual"))}</td><td /></tr></tfoot>
        </table>
      </div>
      <button type="button" className={`${btn} no-print`} onClick={() => setRows([...rows, { id: Date.now(), name: "New expense", planned: "", actual: "" }])}><Plus className="h-4 w-4" aria-hidden />Add expense</button>
      <p className={`rounded-xl p-4 font-semibold ${diff >= 0 ? "bg-secondary text-secondary-foreground" : "bg-destructive/10 text-destructive"}`} aria-live="polite">
        {diff >= 0 ? `Under plan by ${money(diff)}` : `Over plan by ${money(-diff)}`}
      </p>
      <p className="text-xs text-muted-foreground">Your entries are saved only in this browser — nothing is sent to LifeFlow.</p>
    </div>
  );
}

function Timeline({ p }: { p: Planner }) {
  const [date, setDate] = usePersisted<string>(`lf-${p.slug}`, "");
  const [done, setDone] = usePersisted<Record<string, boolean>>(`lf-${p.slug}-done`, {});
  const d = date ? new Date(`${date}T12:00:00`) : null;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5"><label htmlFor="move-date" className="text-sm font-medium">Moving date</label>
          <input id="move-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl border bg-background px-3" /></div>
        <Toolbar onReset={() => { setDate(""); setDone({}); }} />
      </div>
      {!d ? <p className="rounded-xl bg-muted p-4 text-muted-foreground">Choose your moving date to generate your plan.</p> : (
        <ol className="relative space-y-3 border-l-2 border-primary/30 pl-6">
          {timelineTasks.map((t) => {
            const due = new Date(d); due.setDate(due.getDate() - t.weeks * 7);
            return (
              <li key={t.task} className="rounded-2xl border bg-card p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-primary" checked={!!done[t.task]} onChange={(e) => setDone({ ...done, [t.task]: e.target.checked })} />
                  <span><span className="block text-xs font-semibold uppercase text-primary">{due.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · {t.weeks > 0 ? `${t.weeks} week${t.weeks > 1 ? "s" : ""} before` : t.weeks === 0 ? "Moving day" : "After the move"}</span>
                  <span className={done[t.task] ? "text-muted-foreground line-through" : ""}>{t.task}</span></span>
                </label>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function Assessment() {
  const [ans, setAns] = useState<Record<number, number>>({});
  const answered = Object.keys(ans).length;
  const score = Object.values(ans).reduce((a, b) => a + b, 0);
  const max = assessment.length * 2;
  const level = score >= 13 ? ["Well prepared", "Your foundations look strong. Compare lenders and get pre-approved."] : score >= 8 ? ["Getting close", "A few areas need attention — focus on the questions where you scored lowest."] : ["Building foundations", "Focus on savings, debt and an emergency fund before buying. Renting a while longer may be wise."];
  return (
    <div className="space-y-4">
      {assessment.map((q, i) => (
        <fieldset key={q.q} className="rounded-2xl border bg-card p-5">
          <legend className="px-1 font-semibold">{i + 1}. {q.q}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {q.options.map(([label, pts]) => (
              <label key={label} className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${ans[i] === pts ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <input type="radio" className="sr-only" name={`q${i}`} checked={ans[i] === pts} onChange={() => setAns({ ...ans, [i]: pts })} />{label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <div className="rounded-2xl bg-hero p-6 text-ink-foreground" aria-live="polite">
        {answered < assessment.length ? <p>Answered {answered} of {assessment.length} questions.</p> : (<>
          <p className="text-sm text-ink-foreground/75">Your readiness score</p>
          <p className="font-display text-4xl font-semibold">{score} / {max} · {level[0]}</p>
          <p className="mt-2 text-ink-foreground/85">{level[1]}</p>
        </>)}
        <button type="button" onClick={() => setAns({})} className="mt-4 rounded-full bg-ink-foreground/15 px-4 py-2 text-sm font-semibold">Start over</button>
      </div>
      <p className="text-xs text-muted-foreground">This self-assessment is educational and is not a credit or lending decision.</p>
    </div>
  );
}

export function PlannerView({ p }: { p: Planner }) {
  if (p.kind === "checklist") return <Checklist p={p} />;
  if (p.kind === "budget") return <Budget p={p} />;
  if (p.kind === "timeline") return <Timeline p={p} />;
  return <Assessment />;
}
