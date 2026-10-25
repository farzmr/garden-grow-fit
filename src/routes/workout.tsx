import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { FinishSessionModal } from "@/components/FinishSessionModal";
import { FlowerIcon } from "@/components/FlowerIcon";
import { InspirationalBanner } from "@/components/InspirationalBanner";
import { EXERCISE_LIBRARY, imageFor, lastFor, lastLoggedSetsFor, setState, today, uid, useStore, type Exercise, type WeightUnit } from "@/lib/store";

export const Route = createFileRoute("/workout")({
  head: () => ({
    meta: [
      { title: "Today's workout — Bloom" },
      { name: "description", content: "Complete, edit, add or remove exercises in today's workout." },
      { property: "og:title", content: "Today's workout — Bloom" },
      { property: "og:description", content: "Log weights and reps for every set." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
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
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishedFlower, setFinishedFlower] = useState(s.activeFlower ?? s.flower);
  const list = s.active ?? [];
  const total = list.reduce((n, e) => n + e.sets.length, 0);
  const done = list.reduce((n, e) => n + e.sets.filter((x) => x.done).length, 0);

  const add = (name: string) => {
    if (!name.trim()) return;
    const exInfo = imageFor(name.trim());
    const isDuration = exInfo?.trackingType === "duration";
    const defaultTime = exInfo?.timeUnit === "min" ? 20 : 60;
    const prev = lastLoggedSetsFor(s.sessions, name.trim());
    const initialSets = prev && prev.length > 0
      ? prev.map((p) => ({ weight: p.weight, reps: p.reps, time: p.time, done: false }))
      : isDuration
        ? [
            { weight: 0, reps: defaultTime, time: defaultTime, done: false },
            { weight: 0, reps: defaultTime, time: defaultTime, done: false },
            { weight: 0, reps: defaultTime, time: defaultTime, done: false },
          ]
        : [
            { weight: 10, reps: 10, done: false },
            { weight: 10, reps: 10, done: false },
            { weight: 10, reps: 10, done: false },
          ];
    update((l) => [...l, { id: uid(), name: name.trim(), sets: initialSets, weightUnit: "kg" }]);
    setAdding(false);
    setCustom("");
  };

  const toggleWeightUnit = (exId: string) => {
    update((l) =>
      l.map((e) => {
        if (e.id !== exId) return e;
        const currentUnit: WeightUnit = e.weightUnit ?? "kg";
        const nextUnit: WeightUnit = currentUnit === "kg" ? "lb" : "kg";
        const convertedSets = e.sets.map((s) => {
          if (!s.weight) return s;
          const newWeight =
            nextUnit === "lb"
              ? Math.round(s.weight * 2.20462 * 2) / 2
              : Math.round((s.weight / 2.20462) * 2) / 2;
          return { ...s, weight: newWeight };
        });
        return {
          ...e,
          weightUnit: nextUnit,
          sets: convertedSets,
        };
      })
    );
  };

  const finish = (details: { feelingEmoji?: string; notes?: string }) => {
    const completedAt = new Date().toISOString();
    const plantedFlower = s.activeFlower ?? s.flower;
    const minutes = s.activeStartedAt ? Math.max(1, Math.round((Date.now() - new Date(s.activeStartedAt).getTime()) / 60000)) : undefined;
    setState((x) => ({
      ...x,
      active: null,
      activeStartedAt: undefined,
      activeFlower: undefined,
      activePlanName: undefined,
      activePlanId: undefined,
      activeActivity: undefined,
      activeLocation: undefined,
      activeIntensity: undefined,
      sessions: [
        ...x.sessions,
        {
          id: uid(),
          date: today(),
          completedAt,
          planId: x.activePlanId,
          planName: x.activePlanName,
          minutes,
          location: x.activeLocation,
          feelingEmoji: details.feelingEmoji,
          notes: details.notes,
          activity: "Workout",
          exercises: list.map((e) => ({ ...e, sets: e.sets.filter((z) => z.done) })).filter((e) => e.sets.length),
          flower: plantedFlower,
          gardenId: x.mainGarden,
        },
      ],
    }));
    setFinishedFlower(plantedFlower);
    setShowFinishModal(false);
    setPlanted(true);
    setTimeout(() => nav({ to: "/" }), 1600);
  };

  if (planted)
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <span className="animate-bloom text-7xl">{finishedFlower}</span>
        <p className="font-display text-2xl">Great work! Flower planted.</p>
      </div>
    );

  return (
    <div className="space-y-5 px-5 pt-10">
      <header className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-4xl">{s.activePlanName ?? "Workout"}</h1>
            {s.activeLocation && (
              <p className="mt-1 text-xs font-medium text-muted-foreground">📍 {s.activeLocation}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => nav({ to: "/" })}>
            Save & return
          </Button>
        </div>
        <InspirationalBanner />
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{done}/{total} sets done</p>
        </div>
      </header>

      {list.length === 0 && <p className="rounded-3xl bg-card p-6 text-center text-muted-foreground shadow-soft">Nothing planned today — add an exercise below.</p>}

      {list.map((ex) => {
        const info = imageFor(ex.name);
        const last = lastFor(s.sessions, ex.name);
        const allDone = ex.sets.every((x) => x.done);
        const isDuration = info?.trackingType === "duration";
        const unit = info?.timeUnit ?? "sec";
        const defaultDuration = unit === "min" ? 20 : 60;
        const weightUnit: WeightUnit = ex.weightUnit ?? "kg";
        return (
          <article key={ex.id} className={`overflow-hidden rounded-3xl bg-card shadow-soft ${allDone ? "opacity-70" : ""}`}>
            {info?.image && (
              <div className="overflow-hidden bg-muted">
                <img src={info.image} alt={ex.name} loading="lazy" width={816} height={816} className="mx-auto h-48 w-48 object-contain" />
              </div>
            )}
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#2D1B2E]">{ex.name}</h2>
                  {info && (
                    <p className="mt-1 text-xs leading-relaxed text-[#2D1B2E]/70">
                      <span className="font-semibold text-[#4A1D45]">Avoid: </span>
                      {info.avoid ?? info.tip}
                    </p>
                  )}
                  {last && (
                    <p className="mt-1 text-xs font-medium text-[#5E3157]/70">
                      Last: <span className="font-semibold text-[#4A1D45]">{last.best} {last.unit ?? "kg"}</span> on {last.date}
                    </p>
                  )}
                  {info?.myoAtlasLinks && info.myoAtlasLinks.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-2 flex-nowrap overflow-x-auto no-scrollbar min-w-0 max-w-full">
                      {info.myoAtlasLinks.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#D0AECF]/50 bg-[#E8DCEB]/50 px-2.5 py-0.5 text-xs font-medium text-[#4A1D45] transition-colors hover:bg-[#E8DCEB] whitespace-nowrap"
                          >
                            <span className="truncate max-w-[130px]">{link.name}</span>
                            <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
                          </a>
                        ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Remove exercise"
                  onClick={() => update((l) => l.filter((e) => e.id !== ex.id))}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-none bg-[#E8DCEB] text-[#4A1D45] transition-colors hover:bg-[#dfd0e3]"
                >
                  <Trash2 className="h-4 w-4 stroke-[2.2]" />
                </button>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex gap-2 pl-8 pr-24 text-[11px] font-bold tracking-[0.08em] text-[#5E3157] uppercase">
                  {isDuration ? (
                    <span className="flex-1 text-center">DURATION</span>
                  ) : (
                    <div className="flex flex-1 items-center justify-center gap-1">
                      <span>WEIGHT</span>
                      <button
                        type="button"
                        onClick={() => toggleWeightUnit(ex.id)}
                        className="inline-flex items-center rounded-md border border-[#D0AECF]/60 bg-[#E8DCEB] px-1.5 py-0.5 text-[9px] font-bold text-[#4A1D45] transition-colors hover:bg-[#dfd0e3] cursor-pointer"
                        title={`Click to switch between kg and lb (current: ${weightUnit})`}
                      >
                        <span>{weightUnit.toUpperCase()}</span>
                        <span className="ml-0.5 opacity-60">⇄</span>
                      </button>
                    </div>
                  )}
                  {!isDuration && <span className="flex-1 text-center">REPS</span>}
                </div>
                <div className="space-y-0">
                  {ex.sets.map((set, i) => (
                    <div key={i} className="flex items-center gap-2 border-t-[1.5px] border-[#E8DCEB] py-2.5">
                      <span className="w-6 text-center text-base font-bold text-[#4A1D45] shrink-0">{i + 1}</span>
                      {isDuration ? (
                        <NumField
                          value={set.time ?? set.reps ?? defaultDuration}
                          suffix={unit}
                          onChange={(v) => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.map((z, j) => j === i ? { ...z, time: v, reps: v, weight: 0 } : z) } : e))}
                        />
                      ) : (
                        <>
                          <NumField
                            value={set.weight}
                            suffix={weightUnit}
                            onToggleUnit={() => toggleWeightUnit(ex.id)}
                            onChange={(v) => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.map((z, j) => j === i ? { ...z, weight: v } : z) } : e))}
                          />
                          <NumField value={set.reps} suffix="reps" onChange={(v) => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.map((z, j) => j === i ? { ...z, reps: v } : z) } : e))} />
                        </>
                      )}
                      <button
                        type="button"
                        aria-label={set.done ? "Mark set incomplete" : "Complete set"}
                        onClick={() => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.map((z, j) => j === i ? { ...z, done: !z.done } : z) } : e))}
                        className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl transition-all ${
                          set.done
                            ? "border-2 border-[#4A1D45] bg-[#4A1D45] text-white shadow-sm"
                            : "border-2 border-[#D0AECF] bg-white text-[#4A1D45] hover:bg-[#FAF6FA]"
                        }`}
                      >
                        <Check className="h-5 w-5 stroke-[2.2]" />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove set"
                        onClick={() => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.filter((_, j) => j !== i) } : e))}
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-none bg-[#E8DCEB] text-[#4A1D45] transition-colors hover:bg-[#dfd0e3]"
                      >
                        <X className="h-5 w-5 stroke-[2.2]" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pl-8 pt-1.5">
                  <button
                    type="button"
                    onClick={() => update((l) => l.map((e) => {
                      if (e.id !== ex.id) return e;
                      const lastSet = e.sets.at(-1);
                      const currentWeightUnit = e.weightUnit ?? "kg";
                      const defaultWeight = currentWeightUnit === "lb" ? 25 : 10;
                      const newSet = isDuration
                        ? { weight: 0, reps: lastSet?.time ?? lastSet?.reps ?? defaultDuration, time: lastSet?.time ?? lastSet?.reps ?? defaultDuration, done: false }
                        : { ...(lastSet ?? { weight: defaultWeight, reps: 10 }), done: false };
                      return { ...e, sets: [...e.sets, newSet] };
                    }))}
                    className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[18px] border-none bg-[#E8DCEB] text-sm font-bold text-[#4A1D45] transition-colors hover:bg-[#dfd0e3]"
                  >
                    + Set
                  </button>
                  <button
                    type="button"
                    onClick={() => update((l) => l.map((e) => e.id === ex.id ? { ...e, sets: e.sets.map((z) => ({ ...z, done: !allDone })) } : e))}
                    className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[18px] border-none bg-[#4A1D45] text-sm font-bold text-[#E8DCEB] transition-colors hover:bg-[#3d1739]"
                  >
                    {allDone ? "Undo all" : "Complete all"}
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}

      {adding ? (
        <div className="space-y-3 rounded-3xl bg-card p-4 shadow-soft">
          <div className="grid grid-cols-2 gap-2">
            {EXERCISE_LIBRARY.map((e) => (
              <Button key={e.name} onClick={() => add(e.name)} className="rounded-xl bg-muted p-3 text-left text-sm">{e.name}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Other exercise…" className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm" />
            <Button onClick={() => add(custom)} className="rounded-xl bg-primary px-4 text-sm text-primary-foreground">Add</Button>
          </div>
          <Button onClick={() => setAdding(false)} className="w-full text-sm text-muted-foreground">Cancel</Button>
        </div>
      ) : (
        <Button onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border py-4 text-muted-foreground"><Plus className="h-4 w-4" /> Add exercise</Button>
      )}

      <Button
        disabled={done === 0}
        onClick={() => setShowFinishModal(true)}
        className="flex items-center justify-center gap-2 w-full rounded-3xl bg-primary py-5 text-lg font-semibold text-primary-foreground shadow-soft disabled:opacity-40"
      >
        <span>Finish & plant</span>
        <FlowerIcon flower={s.activeFlower ?? s.flower} className="h-6 w-6" />
      </Button>

      <FinishSessionModal
        isOpen={showFinishModal}
        flower={s.activeFlower ?? s.flower}
        activityName={s.activePlanName ?? "Workout"}
        durationMinutes={
          s.activeStartedAt
            ? Math.max(1, Math.round((Date.now() - new Date(s.activeStartedAt).getTime()) / 60000))
            : undefined
        }
        onClose={() => setShowFinishModal(false)}
        onConfirm={finish}
      />
    </div>
  );
}

function NumField({
  value,
  suffix,
  onChange,
  onToggleUnit,
}: {
  value: number;
  suffix: string;
  onChange: (v: number) => void;
  onToggleUnit?: (() => void) | undefined;
}) {
  return (
    <label className="flex h-10 flex-1 box-border cursor-text items-center justify-center gap-1 rounded-2xl bg-[#F1EEE9] px-2 text-[#4A1D45] transition-all focus-within:ring-2 focus-within:ring-[#D0AECF]">
      <input
        type="number"
        inputMode="decimal"
        value={value === 0 && suffix !== "kg" && suffix !== "lb" ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(e.target.value === "" ? 0 : +e.target.value)}
        min={0}
        aria-label={suffix === "kg" || suffix === "lb" ? `Weight in ${suffix}` : suffix}
        className="w-10 bg-transparent text-right font-sans text-base font-semibold text-[#4A1D45] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-[#4A1D45]/30"
      />
      {onToggleUnit ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleUnit();
          }}
          title="Click to switch between kg and lb"
          className="shrink-0 text-xs font-semibold text-[#4A1D45]/75 hover:text-[#4A1D45] underline decoration-dotted underline-offset-2 cursor-pointer transition-colors"
        >
          {suffix}
        </button>
      ) : (
        <span className="shrink-0 text-xs font-normal text-[#4A1D45]/70">{suffix}</span>
      )}
    </label>
  );
}
