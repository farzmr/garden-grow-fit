import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { ExerciseTrend } from "@/components/ExerciseTrend";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History & progress — Bloom" },
      { name: "description", content: "Every workout by date, with weights and reps, and your progress per exercise." },
      { property: "og:title", content: "History & progress — Bloom" },
      { property: "og:description", content: "See what you lifted and when." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const s = useStore();
  const names = [...new Set(s.sessions.flatMap((x) => x.exercises.map((e) => e.name)))];
  const [sel, setSel] = useState<string>("");
  const pick = sel || names[0];

  return (
    <div className="space-y-5 px-5 pt-10">
      <h1 className="font-display text-4xl">History</h1>
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Sessions" value={s.sessions.length} />
        <Stat label="This month" value={s.sessions.filter((x) => x.date.slice(0, 7) === new Date().toISOString().slice(0, 7)).length} />
        <Stat label="Sets" value={s.sessions.reduce((n, x) => n + x.exercises.reduce((m, e) => m + e.sets.length, 0), 0)} />
      </div>

      {names.length > 0 && (
        <section className="space-y-3">
          <select aria-label="Exercise progress" value={pick} onChange={(e) => setSel(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
            {names.map((n) => <option key={n}>{n}</option>)}
          </select>
          {pick && <ExerciseTrend name={pick} />}
        </section>
      )}

      {s.sessions.length === 0 && <p className="text-center text-muted-foreground">No sessions yet. Your first one will show here.</p>}
      {[...s.sessions].reverse().map((x) => (
        <article key={x.id} className="rounded-3xl bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="min-w-0 break-words font-semibold">{x.flower} {x.activity}</p>
            <p className="shrink-0 text-xs text-muted-foreground">{new Date(x.date + "T12:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</p>
          </div>
          <p className="text-xs text-muted-foreground">{x.completedAt ? new Date(x.completedAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "Time not recorded"}{x.minutes !== undefined && ` · ${x.minutes} min`}</p>
          {x.exercises.map((e) => (
            <div key={e.id} className="mt-2 text-sm">
              <p className="font-medium">{e.name}</p>
              <p className="text-muted-foreground">{e.sets.map((z) => `${z.weight}kg×${z.reps}`).join(" · ")}</p>
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-soft">
      <p className="font-display text-2xl">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
