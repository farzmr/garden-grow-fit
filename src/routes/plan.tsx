import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DAYS, EXERCISE_LIBRARY, setState, useStore, type PlanItem } from "@/lib/store";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Weekly plan — Bloom" },
      { name: "description", content: "Set which exercises you do on each day of the week." },
      { property: "og:title", content: "Weekly plan — Bloom" },
      { property: "og:description", content: "Your training plan for every day." },
    ],
  }),
  component: Plan,
});

function Plan() {
  const s = useStore();
  const [day, setDay] = useState(new Date().getDay());
  const items = s.plan[day] ?? [];
  const save = (next: PlanItem[]) => setState((x) => ({ ...x, plan: { ...x.plan, [day]: next } }));

  return (
    <div className="space-y-5 px-5 pt-10">
      <h1 className="font-display text-4xl">Weekly plan</h1>
      <div className="flex gap-1 overflow-x-auto">
        {DAYS.map((d, i) => (
          <button key={d} onClick={() => setDay(i)} className={`flex-1 rounded-xl py-2 text-sm ${day === i ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {d}
            <span className="block text-[10px] opacity-70">{(s.plan[i] ?? []).length || "rest"}</span>
          </button>
        ))}
      </div>
      {items.length === 0 && <p className="text-center text-sm text-muted-foreground">Rest day — add exercises below.</p>}
      {items.map((it, idx) => (
        <div key={idx} className="space-y-2 rounded-3xl bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{it.name}</p>
            <button aria-label="Remove" onClick={() => save(items.filter((_, j) => j !== idx))} className="text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            {(["sets", "reps", "weight"] as const).map((k) => (
              <label key={k} className="space-y-1">
                <span className="capitalize">{k === "weight" ? "kg" : k}</span>
                <input type="number" value={it[k]} onChange={(e) => save(items.map((z, j) => (j === idx ? { ...z, [k]: +e.target.value } : z)))} className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-center text-sm text-foreground" />
              </label>
            ))}
          </div>
        </div>
      ))}
      <select
        value=""
        onChange={(e) => e.target.value && save([...items, { name: e.target.value, sets: 3, reps: 10, weight: 10 }])}
        className="w-full rounded-2xl border border-input bg-card px-4 py-3"
      >
        <option value="">+ Add exercise to {DAYS[day]}</option>
        {EXERCISE_LIBRARY.map((e) => <option key={e.name}>{e.name}</option>)}
      </select>
    </div>
  );
}
