import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Sprout } from "lucide-react";
import { FLOWERS, setState, streak, today, useStore, DAYS } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloom — Your gym garden" },
      { name: "description", content: "See your garden grow with every gym day, track your streak and start today's workout." },
      { property: "og:title", content: "Bloom — Your gym garden" },
      { property: "og:description", content: "A gym tracker where every workout plants a flower." },
    ],
  }),
  component: Home,
});

function Home() {
  const s = useStore();
  const st = streak(s.sessions);
  const doneToday = s.sessions.some((x) => x.date === today());
  const todayPlan = s.plan[new Date().getDay()] ?? [];

  return (
    <div className="space-y-6 px-5 pt-10">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="font-display text-4xl">Your garden</h1>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-accent-foreground">
          <Flame className="h-4 w-4" />
          <span className="font-semibold">{st}</span>
          <span className="text-xs">day{st === 1 ? "" : "s"}</span>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-3xl bg-garden p-4 shadow-soft">
        <div className="grid min-h-56 grid-cols-6 content-end gap-y-1">
          {s.sessions.length === 0 && (
            <div className="col-span-6 flex flex-col items-center gap-2 py-12 text-center text-garden-foreground/80">
              <Sprout className="h-8 w-8" />
              <p className="text-sm">Your first workout plants your first flower.</p>
            </div>
          )}
          {s.sessions.map((x, i) => (
            <span key={x.id} title={`${x.date} · ${x.activity}`} className="animate-sway text-center text-3xl" style={{ animationDelay: `${(i % 6) * 0.3}s` }}>
              {x.flower}
            </span>
          ))}
        </div>
        <div className="mt-2 h-3 rounded-full bg-soil" />
        <p className="mt-3 text-center text-sm text-garden-foreground">{s.sessions.length} flower{s.sessions.length === 1 ? "" : "s"} planted</p>
      </section>

      <Link
        to="/start"
        className="block rounded-3xl bg-primary py-5 text-center text-lg font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
      >
        {doneToday ? "Train again" : "Start today"}
      </Link>

      <section className="rounded-3xl bg-card p-5 shadow-soft">
        <h2 className="mb-2 font-display text-xl">Today · {DAYS[new Date().getDay()]}</h2>
        {todayPlan.length ? (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {todayPlan.map((p, i) => <li key={i}>{p.name} — {p.sets}×{p.reps} @ {p.weight}kg</li>)}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Rest day or class day. <Link to="/plan" className="text-primary underline">Edit plan</Link></p>
        )}
      </section>

      <section className="rounded-3xl bg-card p-5 shadow-soft">
        <h2 className="mb-3 font-display text-xl">Flower you plant</h2>
        <div className="flex flex-wrap gap-2">
          {FLOWERS.map((f) => (
            <button
              key={f}
              onClick={() => setState((x) => ({ ...x, flower: f }))}
              className={`h-12 w-12 rounded-2xl text-2xl transition ${s.flower === f ? "bg-accent ring-2 ring-primary" : "bg-muted"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
