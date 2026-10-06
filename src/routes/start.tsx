import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CLASSES, planToExercises, setState, today, uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start a session — Bloom" },
      { name: "description", content: "Choose a workout or a class like yoga or pilates." },
      { property: "og:title", content: "Start a session — Bloom" },
      { property: "og:description", content: "Pick what you're doing today." },
    ],
  }),
  component: Start,
});

function Start() {
  const s = useStore();
  const nav = useNavigate();
  const [cls, setCls] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(45);
  const [planted, setPlanted] = useState(false);

  const pick = (c: string) => {
    if (c === "Workout") {
      if (!s.active) setState((x) => ({ ...x, active: planToExercises(x.plan[new Date().getDay()] ?? []) }));
      nav({ to: "/workout" });
    } else setCls(c);
  };

  const finishClass = () => {
    setState((x) => ({
      ...x,
      sessions: [...x.sessions, { id: uid(), date: today(), activity: cls!, minutes, exercises: [], flower: x.flower }],
    }));
    setPlanted(true);
    setTimeout(() => nav({ to: "/" }), 1600);
  };

  if (planted)
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <span className="animate-bloom text-7xl">{s.flower}</span>
        <p className="font-display text-2xl">Planted in your garden!</p>
      </div>
    );

  return (
    <div className="space-y-6 px-5 pt-10">
      <h1 className="font-display text-4xl">What are you doing today?</h1>
      {!cls ? (
        <div className="grid grid-cols-2 gap-3">
          {CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => pick(c)}
              className={`rounded-3xl p-6 text-left text-lg font-semibold shadow-soft active:scale-[0.98] ${c === "Workout" ? "col-span-2 bg-primary text-primary-foreground" : "bg-card"}`}
            >
              {c}
              {c === "Workout" && <span className="block text-sm font-normal opacity-80">{s.active ? "Continue your session" : "See today's plan"}</span>}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-5 rounded-3xl bg-card p-6 shadow-soft">
          <p className="text-xl font-semibold">{cls}</p>
          <label className="block text-sm text-muted-foreground">
            How long? <span className="font-semibold text-foreground">{minutes} min</span>
            <input type="range" min={10} max={120} step={5} value={minutes} onChange={(e) => setMinutes(+e.target.value)} className="mt-2 w-full accent-[var(--primary)]" />
          </label>
          <button onClick={finishClass} className="w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground">
            Done — plant my {s.flower}
          </button>
          <button onClick={() => setCls(null)} className="w-full text-sm text-muted-foreground">Back</button>
        </div>
      )}
    </div>
  );
}
