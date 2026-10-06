import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { EXERCISE_LIBRARY, imageFor, lastFor, setState, today, uid, useStore, type Exercise } from "@/lib/store";

export const Route = createFileRoute("/workout")({
  head: () => ({
    meta: [
      { title: "Today's workout — Bloom" },
      { name: "description", content: "Complete, edit, add or remove exercises in today's workout." },
      { property: "og:title", content: "Today's workout — Bloom" },
      { property: "og:description", content: "Log weights and reps for every set." },
    ],
  }),
  component: Workout,
});

function update(fn: (ex: Exercise[]) => Exercise[]) {
  setState((x) => ({ ...x, active: fn(x.active ?? []) }));
}

function Workout() {
  const s = useStore();
  const nav = useNavigate();
  const [adding, setAdding] = useState(false);
  const [custom, setCustom] = useState("");
  const [planted, setPlanted] = useState(false);
  const list = s.active ?? [];
  const total = list.reduce((n, e) => n + e.sets.length, 0);
  const done = list.reduce((n, e) => n + e.sets.filter((x) => x.done).length, 0);

  const add = (name: string) => {
    if (!name.trim()) return;
    update((l) => [...l, { id: uid(), name: name.trim(), sets: [{ weight: 10, reps: 10, done: false }, { weight: 10, reps: 10, done: false }, { weight: 10, reps: 10, done: false }] }]);
    setAdding(false);
    setCustom("");
  };

  const finish = () => {
    setState((x) => ({
      ...x,
      active: null,
      sessions: [...x.sessions, { id: uid(), date: today(), activity: "Workout", exercises: list.map((e) => ({ ...e, sets: e.sets.filter((z) => z.done) })).filter((e) => e.sets.length), flower: x.flower }],
    }));
    setPlanted(true);
    setTimeout(() => nav({ to: "/" }), 1600);
  };

  if (planted)
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <span className="animate-bloom text-7xl">{s.flower}</span>
        <p className="font-display text-2xl">Great work! Flower planted.</p>
      </div>
    );

  return (
    <div className="space-y-5 px-5 pt-10">
      <header>
        <h1 className="font-display text-4xl">Today's workout</h1>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{done}/{total} sets done</p>
      </header>

      {list.length === 0 && <p className="rounded-3xl bg-card p-6 text-center text-muted-foreground shadow-soft">Nothing planned today — add an exercise below.</p>}

      {list.map((ex) => {
        const info = imageFor(ex.name);
        const last = lastFor(s.sessions, ex.name);
        const allDone = ex.sets.every((x) => x.done);
        return (
          <article key={ex.id} className={`overflow-hidden rounded-3xl bg-card shadow-soft ${allDone ? "opacity-70" : ""}`}>
            {info?.image && (
              <div className="overflow-hidden bg-muted">
                <img src={info.image} alt={ex.name} loading="lazy" width={816} height={816} className="animate-rep mx-auto h-48 w-48 object-contain" />
              </div>
            )}
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{ex.name}</h2>
                  {info && <p className="text-xs text-muted-foreground">{info.tip}</p>}
                  {last && <p className="mt-1 text-xs text-primary">Last: {last.best}kg on {last.date}</p>}
                </div>
                <button aria-label="Remove exercise" onClick={() => update((l) => l.filter((e) => e.id !== ex.id))} className="p-2 text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="space-y-2">
                {ex.sets.map((set, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 text-sm text-muted-foreground">{i + 1}</span>
                    <NumField value={set.weight} suffix="kg" onChange={(v) => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.map((z, j) => j === i ? { ...z, weight: v } : z) } : e))} />
                    <NumField value={set.reps} suffix="reps" onChange={(v) => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.map((z, j) => j === i ? { ...z, reps: v } : z) } : e))} />
                    <button
                      aria-label="Complete set"
                      onClick={() => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.map((z, j) => j === i ? { ...z, done: !z.done } : z) } : e))}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${set.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button aria-label="Remove set" onClick={() => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.filter((_, j) => j !== i) } : e))} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: [...e.sets, { ...(e.sets.at(-1) ?? { weight: 10, reps: 10 }), done: false }] } : e))} className="flex-1 rounded-xl bg-muted py-2 text-sm">+ Set</button>
                <button onClick={() => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.map((z) => ({ ...z, done: !allDone })) } : e))} className="flex-1 rounded-xl bg-accent py-2 text-sm font-semibold text-accent-foreground">{allDone ? "Undo" : "Complete all"}</button>
              </div>
            </div>
          </article>
        );
      })}

      {adding ? (
        <div className="space-y-3 rounded-3xl bg-card p-4 shadow-soft">
          <div className="grid grid-cols-2 gap-2">
            {EXERCISE_LIBRARY.map((e) => (
              <button key={e.name} onClick={() => add(e.name)} className="rounded-xl bg-muted p-3 text-left text-sm">{e.name}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Other exercise…" className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm" />
            <button onClick={() => add(custom)} className="rounded-xl bg-primary px-4 text-sm text-primary-foreground">Add</button>
          </div>
          <button onClick={() => setAdding(false)} className="w-full text-sm text-muted-foreground">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border py-4 text-muted-foreground"><Plus className="h-4 w-4" /> Add exercise</button>
      )}

      <button disabled={done === 0} onClick={finish} className="w-full rounded-3xl bg-primary py-5 text-lg font-semibold text-primary-foreground shadow-soft disabled:opacity-40">
        Finish & plant {s.flower}
      </button>
    </div>
  );
}

function NumField({ value, suffix, onChange }: { value: number; suffix: string; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-1 items-center rounded-xl border border-input bg-background px-2">
      <input type="number" inputMode="decimal" value={value} onChange={(e) => onChange(+e.target.value)} className="w-full bg-transparent py-2 text-center outline-none" />
      <span className="text-xs text-muted-foreground">{suffix}</span>
    </label>
  );
}
