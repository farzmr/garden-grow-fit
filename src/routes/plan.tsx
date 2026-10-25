import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Dumbbell, Clock3, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_PLANS, EXERCISE_LIBRARY, imageFor, lastUsedFor, setState, uid, useStore, type WorkoutPlan, type Difficulty } from "@/lib/store";

export const Route = createFileRoute("/plan")({
  head: () => ({ meta: [
    { title: "Workout plans — Bloom" },
    { name: "description", content: "Create and edit reusable workout routines." },
    { property: "og:title", content: "Workout plans — Bloom" },
    { property: "og:description", content: "Your reusable gym plans and exercises." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Plans,
});

function Plans() {
  const s = useStore();
  const plans = s.plans.length > 0 ? s.plans : DEFAULT_PLANS;
  const [selected, setSelected] = useState<string | null>(null);
  const current = plans.find(plan => plan.id === selected);
  const save = (plan: WorkoutPlan) => setState(x => ({...x, plans: (x.plans.length ? x.plans : DEFAULT_PLANS).map(p => p.id === plan.id ? plan : p)}));
  const createPlan = () => {
    const plan: WorkoutPlan = { id:uid(), name:"My new plan", items:[], difficulty:"Beginner" };
    setState(x => ({...x, plans: [...(x.plans.length ? x.plans : DEFAULT_PLANS), plan]}));
    setSelected(plan.id);
  };

  if (current) return (
    <div className="space-y-5 px-5 pt-10">
      <Button variant="ghost" onClick={() => setSelected(null)}><ChevronLeft /> All plans</Button>
      <input aria-label="Plan name" value={current.name} onChange={e => save({...current,name:e.target.value})} className="w-full border-b border-input bg-transparent py-2 font-display text-3xl outline-none" />
      <p className="text-sm text-muted-foreground">{current.items.length} exercises</p>
      <label className="flex items-center justify-between gap-3 text-sm text-muted-foreground">Difficulty<select aria-label="Plan difficulty" value={current.difficulty ?? "Intermediate"} onChange={e => save({...current,difficulty:e.target.value as Difficulty})} className="rounded-lg border border-input bg-card px-3 py-2 text-foreground"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
      <p className="text-xs text-muted-foreground">Suggested routines are editable. Choose weights that feel comfortable for you.</p>

      <div className="divide-y divide-border">
        {current.items.map((item, index) => {
          const info = imageFor(item.name);
          const isDuration = info?.trackingType === "duration";
          const unit = info?.timeUnit ?? "sec";
          return (
            <article key={`${item.name}-${index}`} className="space-y-3 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/50">
                    {info?.image ? (
                      <img
                        src={info.image}
                        alt={item.name}
                        width={56}
                        height={56}
                        loading="lazy"
                        className="h-full w-full object-contain p-0.5"
                      />
                    ) : (
                      <Dumbbell className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h2 className="break-words font-semibold leading-tight">{item.name}</h2>
                      {info?.category && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {info.category}
                        </span>
                      )}
                    </div>
                    {info?.tip && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{info.tip}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => save({ ...current, items: current.items.filter((_, i) => i !== index) })}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              {isDuration ? (
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-muted-foreground">
                    <span>Sets</span>
                    <input
                      type="number"
                      min={1}
                      value={item.sets}
                      onChange={(e) =>
                        save({
                          ...current,
                          items: current.items.map((it, i) => (i === index ? { ...it, sets: +e.target.value } : it)),
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-input bg-card px-2 py-2 text-center text-foreground"
                    />
                  </label>
                  <label className="text-xs text-muted-foreground">
                    <span>Duration ({unit})</span>
                    <input
                      type="number"
                      min={1}
                      value={item.time ?? (unit === "min" ? 20 : 60)}
                      onChange={(e) =>
                        save({
                          ...current,
                          items: current.items.map((it, i) => (i === index ? { ...it, time: +e.target.value } : it)),
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-input bg-card px-2 py-2 text-center text-foreground"
                    />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {(["sets", "reps", "weight"] as const).map((field) => (
                    <label key={field} className="text-xs text-muted-foreground">
                      <span>{field === "weight" ? "kg / level" : field}</span>
                      <input
                        type="number"
                        min={0}
                        value={item[field]}
                        onChange={(e) =>
                          save({
                            ...current,
                            items: current.items.map((it, i) => (i === index ? { ...it, [field]: +e.target.value } : it)),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-input bg-card px-2 py-2 text-center text-foreground"
                      />
                    </label>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <select
        aria-label="Add exercise"
        value=""
        onChange={(e) => {
          if (e.target.value) {
            const addedInfo = imageFor(e.target.value);
            const isDur = addedInfo?.trackingType === "duration";
            const defaultItem = {
              name: e.target.value,
              sets: 3,
              reps: isDur ? 1 : 10,
              weight: 10,
              ...(isDur ? { time: addedInfo?.timeUnit === "min" ? 20 : 60 } : {}),
            };
            save({
              ...current,
              items: [...current.items, defaultItem],
            });
          }
        }}
        className="w-full rounded-xl border border-input bg-card px-3 py-3"
      >
        <option value="">+ Add exercise</option>
        {EXERCISE_LIBRARY.filter(ex => !current.items.some(item => item.name === ex.name)).map(ex => (
          <option key={ex.name} value={ex.name}>{ex.name}</option>
        ))}
      </select>

      <Button
        variant="destructive"
        className="w-full"
        onClick={() => {
          setState(x => ({ ...x, plans: x.plans.filter(p => p.id !== current.id) }));
          setSelected(null);
        }}
      >
        <Trash2 /> Delete plan
      </Button>
    </div>
  );

  return (
    <div className="space-y-5 px-5 pt-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Reusable routines</p>
          <h1 className="font-display text-4xl">Plans</h1>
        </div>
        <Button size="icon" aria-label="Create plan" onClick={createPlan}><Plus /></Button>
      </div>

      <div className="space-y-3">
        {plans.map((plan) => {
          const used = lastUsedFor(s.sessions, plan);
          return (
            <Button
              key={plan.id}
              variant="ghost"
              onClick={() => setSelected(plan.id)}
              className="h-auto w-full justify-between gap-3 whitespace-normal rounded-xl border border-border bg-card p-4 text-left shadow-soft"
            >
              <span className="min-w-0 flex-1">
                <span className="block break-words text-base font-semibold">{plan.name}</span>

                {plan.items.length > 0 && (
                  <span className="mt-3 flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                    {plan.items.slice(0, 5).map((it, idx) => {
                      const itInfo = imageFor(it.name);
                      return (
                        <span
                          key={`${it.name}-${idx}`}
                          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/40"
                          title={it.name}
                        >
                          {itInfo?.image ? (
                            <img
                              src={itInfo.image}
                              alt={it.name}
                              width={44}
                              height={44}
                              loading="lazy"
                              className="h-full w-full object-contain p-0.5"
                            />
                          ) : (
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                          )}
                        </span>
                      );
                    })}
                    {plan.items.length > 5 && (
                      <span className="flex h-11 shrink-0 items-center rounded-lg bg-muted/60 px-2 text-xs font-semibold text-muted-foreground">
                        +{plan.items.length - 5}
                      </span>
                    )}
                  </span>
                )}

                <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-normal text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="h-3.5 w-3.5" />
                    {plan.items.length} exercises
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <Signal className="h-3.5 w-3.5" />
                    {plan.difficulty ?? "Intermediate"}
                  </span>
                </span>
                <span className="mt-2 flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {used
                    ? `Last used ${new Date(used).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : "Not used yet"}
                </span>
              </span>
              <ChevronRight className="shrink-0 text-muted-foreground" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
