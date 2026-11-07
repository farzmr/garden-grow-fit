import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import { Check, ChevronDown, ChevronUp, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { FinishSessionModal } from "@/components/FinishSessionModal";
import { PlanUpdateModal } from "@/components/PlanUpdateModal";
import { ExercisePickerModal } from "@/components/ExercisePickerModal";
import { PresetPickerModal } from "@/components/PresetPickerModal";
import { FlowerIcon } from "@/components/FlowerIcon";
import { InspirationalBanner } from "@/components/InspirationalBanner";
import {
  DEFAULT_PLANS,
  ensureDefaultPlans,
  getCardioSettings,
  imageFor,
  lastFor,
  lastLoggedSetsFor,
  setState,
  today,
  uid,
  useStore,
  type CardioSettingConfig,
  type Exercise,
  type ExerciseInfo,
  type WeightUnit,
  type WorkoutPlan,
} from "@/lib/store";

export const Route = createFileRoute("/workout")({
  head: () => ({
    meta: [
      { title: "Today's workout — Bloom" },
      { name: "description", content: "Complete, edit, add or remove exercises in today's workout." },
      { property: "og:title", content: "Today's workout — Bloom" },
      { property: "og:description", content: "Log weights and reps for every set." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workout,
});

function update(fn: (ex: Exercise[]) => Exercise[]) {
  setState((x) => ({ ...x, active: fn(x.active ?? []) }));
}

const WEIGHT_PRESETS = Array.from({ length: 101 }, (_, i) => i * 5); // 0 to 500 lb, 5 by 5
const REPS_PRESETS = Array.from({ length: 50 }, (_, i) => i + 1); // 1 to 50 reps, 1 by 1
const DURATION_MIN_PRESETS = Array.from({ length: 90 }, (_, i) => i + 1); // 1 to 90 min
const DURATION_SEC_PRESETS = Array.from({ length: 60 }, (_, i) => (i + 1) * 5); // 5 to 300 sec

function formatExerciseSummary(ex: Exercise, info?: ExerciseInfo) {
  const isCardio = info?.category === "Cardio";
  const isDuration = info?.trackingType === "duration";
  const unit = info?.timeUnit ?? "sec";
  const weightUnit = ex.weightUnit ?? "lb";

  if (isCardio) {
    const first = ex.sets[0];
    const parts: string[] = [`${first?.time ?? first?.reps ?? 20} ${unit}`];
    if (first?.speed) parts.push(`${first.speed} mph`);
    if (first?.incline) parts.push(`Incline ${first.incline}%`);
    if (first?.resistance) parts.push(`Res ${first.resistance}`);
    if (first?.level) parts.push(`Lvl ${first.level}`);
    if (first?.cadence) parts.push(`${first.cadence} rpm`);
    return `${ex.sets.length} ${ex.sets.length === 1 ? "set" : "sets"} · ${parts.join(" · ")}`;
  }

  if (isDuration) {
    const maxTime = Math.max(0, ...ex.sets.map((s) => s.time ?? s.reps ?? 0));
    return `${ex.sets.length} ${ex.sets.length === 1 ? "set" : "sets"} completed · ${maxTime} ${unit}`;
  }

  const maxW = Math.max(0, ...ex.sets.map((s) => s.weight));
  const maxR = Math.max(0, ...ex.sets.map((s) => s.reps));
  return `${ex.sets.length} ${ex.sets.length === 1 ? "set" : "sets"} completed · ${maxW} ${weightUnit} × ${maxR} reps`;
}

function Workout() {
  const s = useStore();
  const nav = useNavigate();
  const posthog = usePostHog();
  const [adding, setAdding] = useState(false);
  const [planted, setPlanted] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showPlanUpdateModal, setShowPlanUpdateModal] = useState(false);
  const [openOverrides, setOpenOverrides] = useState<Record<string, boolean>>({});

  // Preset picker modal state
  const [pickerConfig, setPickerConfig] = useState<{
    isOpen: boolean;
    title: string;
    value: number;
    suffix: string;
    step: number;
    presets: number[];
    min?: number;
    max?: number;
    onSelect: (v: number) => void;
  }>({
    isOpen: false,
    title: "",
    value: 0,
    suffix: "",
    step: 1,
    presets: [],
    onSelect: () => {},
  });

  const [pendingFinishDetails, setPendingFinishDetails] = useState<{
    feelingEmoji?: string | undefined;
    notes?: string | undefined;
  }>({});
  const [finishedFlower, setFinishedFlower] = useState(s.activeFlower ?? s.flower);
  const list = s.active ?? [];
  const total = list.reduce((n, e) => n + e.sets.length, 0);
  const done = list.reduce((n, e) => n + e.sets.filter((x) => x.done).length, 0);

  // Original plan comparison
  const allPlans = ensureDefaultPlans(s.plans);
  const originalPlan = allPlans.find((p) => p.id === s.activePlanId);
  const origExerciseNames = originalPlan ? originalPlan.items.map((i) => i.name) : [];
  const currentExerciseNames = list.map((e) => e.name);

  const addedExercises = originalPlan
    ? currentExerciseNames.filter((name) => !origExerciseNames.includes(name))
    : [];
  const removedExercises = originalPlan
    ? origExerciseNames.filter((name) => !currentExerciseNames.includes(name))
    : [];
  const hasPlanChanges = Boolean(originalPlan && (addedExercises.length > 0 || removedExercises.length > 0));

  const add = (name: string) => {
    if (!name.trim()) return;
    const exInfo = imageFor(name.trim());
    const isCardio = exInfo?.category === "Cardio";
    const isDuration = exInfo?.trackingType === "duration";
    const defaultTime = exInfo?.timeUnit === "min" ? 20 : 60;
    const prev = lastLoggedSetsFor(s.sessions, name.trim());
    const cardioConfigs = isCardio ? getCardioSettings(name.trim()) : [];
    const cardioDefaults: Record<string, number> = {};
    for (const c of cardioConfigs) {
      cardioDefaults[c.key] = c.defaultVal;
    }

    const initialSets = prev && prev.length > 0
      ? (isCardio ? [prev[0]!] : prev).map((p) => ({
          weight: p.weight,
          reps: p.reps,
          time: p.time ?? (isDuration ? defaultTime : undefined),
          speed: p.speed ?? cardioDefaults.speed,
          incline: p.incline ?? cardioDefaults.incline,
          resistance: p.resistance ?? cardioDefaults.resistance,
          level: p.level ?? cardioDefaults.level,
          cadence: p.cadence ?? cardioDefaults.cadence,
          done: false,
        }))
      : isCardio
        ? [
            {
              weight: 0,
              reps: defaultTime,
              time: defaultTime,
              speed: cardioDefaults.speed,
              incline: cardioDefaults.incline,
              resistance: cardioDefaults.resistance,
              level: cardioDefaults.level,
              cadence: cardioDefaults.cadence,
              done: false,
            },
          ]
        : isDuration
          ? [
              { weight: 0, reps: defaultTime, time: defaultTime, done: false },
              { weight: 0, reps: defaultTime, time: defaultTime, done: false },
              { weight: 0, reps: defaultTime, time: defaultTime, done: false },
            ]
          : [
              { weight: 25, reps: 10, done: false },
              { weight: 25, reps: 10, done: false },
              { weight: 25, reps: 10, done: false },
            ];

    update((l) => [...l, { id: uid(), name: name.trim(), sets: initialSets, weightUnit: "lb" }]);
    setAdding(false);
  };

  const toggleWeightUnit = (exId: string) => {
    update((l) =>
      l.map((e) => {
        if (e.id !== exId) return e;
        const currentUnit: WeightUnit = e.weightUnit ?? "lb";
        const nextUnit: WeightUnit = currentUnit === "lb" ? "kg" : "lb";
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

  const handleFinishModalConfirm = (details: { feelingEmoji?: string; notes?: string }) => {
    setShowFinishModal(false);
    setPendingFinishDetails(details);
    if (hasPlanChanges && originalPlan) {
      setShowPlanUpdateModal(true);
    } else {
      completeFinish(details);
    }
  };

  const handleUpdatePlan = () => {
    if (originalPlan) {
      posthog.capture("workout_plan_updated", {
        added_exercise_count: addedExercises.length,
        removed_exercise_count: removedExercises.length,
      });
      const updatedPlan: WorkoutPlan = {
        ...originalPlan,
        items: list.map((ex) => {
          const existing = originalPlan.items.find((it) => it.name === ex.name);
          if (existing) {
            return {
              ...existing,
              sets: ex.sets.length > 0 ? ex.sets.length : existing.sets,
            };
          }
          const exInfo = imageFor(ex.name);
          const isDur = exInfo?.trackingType === "duration";
          return {
            name: ex.name,
            sets: ex.sets.length || (exInfo?.category === "Cardio" ? 1 : 3),
            reps: isDur ? 1 : (ex.sets[0]?.reps || 10),
            weight: ex.sets[0]?.weight || 10,
            ...(isDur ? { time: ex.sets[0]?.time ?? (exInfo?.timeUnit === "min" ? 20 : 60) } : {}),
          };
        }),
      };
      setState((x) => ({
        ...x,
        plans: (x.plans.length ? x.plans : DEFAULT_PLANS).map((p) =>
          p.id === updatedPlan.id ? updatedPlan : p
        ),
      }));
    }
    setShowPlanUpdateModal(false);
    completeFinish(pendingFinishDetails);
  };

  const handleSaveAsNewPlan = (newPlanName: string) => {
    if (originalPlan) {
      posthog.capture("workout_plan_saved", {
        exercise_count: list.length,
      });
      const newPlan: WorkoutPlan = {
        id: uid(),
        name: newPlanName.trim() || `${originalPlan.name} (Updated)`,
        difficulty: originalPlan.difficulty ?? "Intermediate",
        items: list.map((ex) => {
          const existing = originalPlan.items.find((it) => it.name === ex.name);
          if (existing) {
            return {
              ...existing,
              sets: ex.sets.length > 0 ? ex.sets.length : existing.sets,
            };
          }
          const exInfo = imageFor(ex.name);
          const isDur = exInfo?.trackingType === "duration";
          return {
            name: ex.name,
            sets: ex.sets.length || (exInfo?.category === "Cardio" ? 1 : 3),
            reps: isDur ? 1 : (ex.sets[0]?.reps || 10),
            weight: ex.sets[0]?.weight || 10,
            ...(isDur ? { time: ex.sets[0]?.time ?? (exInfo?.timeUnit === "min" ? 20 : 60) } : {}),
          };
        }),
      };
      setState((x) => ({
        ...x,
        plans: [...(x.plans.length ? x.plans : DEFAULT_PLANS), newPlan],
      }));
    }
    setShowPlanUpdateModal(false);
    completeFinish(pendingFinishDetails);
  };

  const handleDiscardChanges = () => {
    setShowPlanUpdateModal(false);
    completeFinish(pendingFinishDetails);
  };

  const completeFinish = (details?: { feelingEmoji?: string; notes?: string }) => {
    const completedAt = new Date().toISOString();
    const plantedFlower = s.activeFlower ?? s.flower;
    const minutes = s.activeStartedAt
      ? Math.max(1, Math.round((Date.now() - new Date(s.activeStartedAt).getTime()) / 60000))
      : undefined;
    posthog.capture("workout_completed", {
      completed_exercise_count: list.filter((exercise) => exercise.sets.some((set) => set.done)).length,
      completed_set_count: done,
      duration_minutes: minutes,
    });
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
          feelingEmoji: details?.feelingEmoji,
          notes: details?.notes,
          activity: "Workout",
          exercises: list
            .map((e) => ({
              ...e,
              weightUnit: e.weightUnit ?? "lb",
              sets: e.sets.filter((z) => z.done),
            }))
            .filter((e) => e.sets.length),
          flower: plantedFlower,
          gardenId: x.mainGarden,
        },
      ],
    }));
    setFinishedFlower(plantedFlower);
    setPlanted(true);
    setTimeout(() => nav({ to: "/" }), 1600);
  };

  // Preset picker openers
  const openWeightPicker = (current: number, unit: WeightUnit, onSave: (val: number) => void) => {
    setPickerConfig({
      isOpen: true,
      title: `Select Weight (${unit})`,
      value: current,
      suffix: unit,
      step: 5,
      presets: WEIGHT_PRESETS,
      min: 0,
      onSelect: (val) => {
        setPickerConfig((prev) => ({ ...prev, value: val }));
        onSave(val);
      },
    });
  };

  const openRepsPicker = (current: number, onSave: (val: number) => void) => {
    setPickerConfig({
      isOpen: true,
      title: "Select Reps",
      value: current,
      suffix: "reps",
      step: 1,
      presets: REPS_PRESETS,
      min: 1,
      onSelect: (val) => {
        setPickerConfig((prev) => ({ ...prev, value: val }));
        onSave(val);
      },
    });
  };

  const openDurationPicker = (current: number, unit: "min" | "sec", onSave: (val: number) => void) => {
    setPickerConfig({
      isOpen: true,
      title: `Select Duration (${unit})`,
      value: current,
      suffix: unit,
      step: unit === "min" ? 5 : 5,
      presets: unit === "min" ? DURATION_MIN_PRESETS : DURATION_SEC_PRESETS,
      min: 1,
      onSelect: (val) => {
        setPickerConfig((prev) => ({ ...prev, value: val }));
        onSave(val);
      },
    });
  };

  const openCardioSettingPicker = (
    cfg: CardioSettingConfig,
    current: number,
    onSave: (val: number) => void
  ) => {
    setPickerConfig({
      isOpen: true,
      title: `Select ${cfg.label} (${cfg.suffix})`,
      value: current,
      suffix: cfg.suffix,
      step: cfg.step,
      presets: cfg.presets,
      min: cfg.min ?? 0,
      max: cfg.max ?? 999,
      onSelect: (val) => {
        setPickerConfig((prev) => ({ ...prev, value: val }));
        onSave(val);
      },
    });
  };

  if (planted) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <span className="animate-bloom text-7xl">{finishedFlower}</span>
        <p className="font-display text-2xl">Great work! Flower planted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-5 pt-10 pb-16">
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
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{done}/{total} sets done</p>
        </div>
      </header>

      {list.length === 0 && (
        <p className="rounded-3xl bg-card p-6 text-center text-muted-foreground shadow-soft">
          Nothing planned today — add an exercise below.
        </p>
      )}

      {list.map((ex) => {
        const info = imageFor(ex.name);
        const last = lastFor(s.sessions, ex.name);
        const allDone = ex.sets.length > 0 && ex.sets.every((x) => x.done);
        const isCollapsed = allDone && !openOverrides[ex.id];
        const isCardio = info?.category === "Cardio";
        const isDuration = info?.trackingType === "duration";
        const unit = info?.timeUnit ?? "sec";
        const defaultDuration = unit === "min" ? 20 : 60;
        const weightUnit: WeightUnit = ex.weightUnit ?? "lb";
        const cardioConfigs = isCardio ? getCardioSettings(ex.name) : [];

        // Shortened / closed drawer state when marked complete
        if (isCollapsed) {
          return (
            <article
              key={ex.id}
              onClick={() => setOpenOverrides((prev) => ({ ...prev, [ex.id]: true }))}
              className="flex items-center justify-between gap-3 rounded-3xl border border-[#D0AECF]/50 bg-[#FAF7F2] dark:bg-card p-4 shadow-soft cursor-pointer transition-all hover:bg-[#F4EDF5] dark:hover:bg-muted/40 active:scale-[0.99]"
              role="button"
              tabIndex={0}
              aria-expanded={false}
              aria-label={`${ex.name} completed. Tap to open drawer.`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenOverrides((prev) => ({ ...prev, [ex.id]: true }));
                }
              }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4A1D45] text-white shadow-sm">
                  <Check className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#2D1B2E] dark:text-foreground truncate">
                      {ex.name}
                    </h2>
                    <span className="shrink-0 rounded-full bg-[#E8DCEB] dark:bg-[#4A1D45]/30 px-2 py-0.5 text-[10px] font-bold text-[#4A1D45] dark:text-[#E8DCEB]">
                      Done
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#5E3157]/80 dark:text-muted-foreground truncate">
                    {formatExerciseSummary(ex, info)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-[#4A1D45] dark:text-[#E8DCEB] hidden sm:inline">
                  Open drawer
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#E8DCEB] dark:bg-[#4A1D45]/40 text-[#4A1D45] dark:text-[#E8DCEB] transition-colors">
                  <ChevronDown className="h-4 w-4 stroke-[2.2]" />
                </div>
              </div>
            </article>
          );
        }

        return (
          <article
            key={ex.id}
            className={`overflow-hidden rounded-3xl bg-card shadow-soft transition-all ${
              allDone ? "ring-2 ring-[#4A1D45]/30" : ""
            }`}
          >
            {info?.image && (
              <div className="overflow-hidden bg-muted">
                <img
                  src={info.image}
                  alt={ex.name}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="mx-auto h-48 w-48 object-contain"
                />
              </div>
            )}
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <h2 className="text-xl font-bold tracking-tight text-[#2D1B2E] dark:text-foreground truncate">
                    {ex.name}
                  </h2>
                  {isCardio && (
                    <span className="shrink-0 rounded-full bg-[#E8DCEB] dark:bg-muted px-2 py-0.5 text-[10px] font-bold text-[#4A1D45] dark:text-foreground">
                      Cardio
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {allDone && (
                    <button
                      type="button"
                      title="Close drawer"
                      onClick={() => setOpenOverrides((prev) => ({ ...prev, [ex.id]: false }))}
                      className="flex h-10 items-center gap-1 px-2.5 rounded-2xl border-none bg-[#E8DCEB] text-xs font-bold text-[#4A1D45] hover:bg-[#dfd0e3] transition-colors cursor-pointer"
                    >
                      <span className="hidden sm:inline">Close</span>
                      <ChevronUp className="h-4 w-4 stroke-[2.2]" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Remove exercise"
                    aria-label={`Remove ${ex.name}`}
                    onClick={() => update((l) => l.filter((e) => e.id !== ex.id))}
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-none bg-[#E8DCEB] text-[#4A1D45] transition-colors hover:bg-[#dfd0e3]"
                  >
                    <Trash2 className="h-4 w-4 stroke-[2.2]" />
                  </button>
                </div>
              </div>

              {info && (
                <p className="text-xs leading-relaxed text-[#2D1B2E]/70 dark:text-muted-foreground">
                  <span className="font-semibold text-[#4A1D45] dark:text-foreground">Avoid: </span>
                  {info.avoid ?? info.tip}
                </p>
              )}
              {last && (
                <p className="text-xs font-medium text-[#5E3157]/70 dark:text-muted-foreground">
                  Last: <span className="font-semibold text-[#4A1D45] dark:text-foreground">{last.best} {last.unit ?? "lb"}</span> on {last.date}
                </p>
              )}
              {info?.myoAtlasLinks && info.myoAtlasLinks.length > 0 && (
                <div className="flex items-center gap-1.5 pt-0.5 flex-nowrap overflow-x-auto no-scrollbar w-full">
                  {info.myoAtlasLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#D0AECF]/50 bg-[#E8DCEB]/50 px-2.5 py-0.5 text-xs font-medium text-[#4A1D45] transition-colors hover:bg-[#E8DCEB] whitespace-nowrap"
                    >
                      <span className="truncate max-w-[150px]">{link.name}</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
                    </a>
                  ))}
                </div>
              )}

              {/* Set Headers */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2 pl-8 pr-[88px] text-[11px] font-bold tracking-[0.08em] text-[#5E3157] dark:text-muted-foreground uppercase">
                  {isCardio ? (
                    <div className="grid flex-1 grid-flow-col auto-cols-fr gap-1.5 text-center">
                      <span className="truncate">DURATION</span>
                      {cardioConfigs.map((cfg) => (
                        <span key={cfg.key} className="truncate">
                          {cfg.label}
                        </span>
                      ))}
                    </div>
                  ) : isDuration ? (
                    <span className="flex-1 text-center">DURATION</span>
                  ) : (
                    <div className="grid flex-1 grid-flow-col auto-cols-fr gap-1.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span>WEIGHT</span>
                        <button
                          type="button"
                          onClick={() => toggleWeightUnit(ex.id)}
                          className="inline-flex items-center rounded-md border border-[#D0AECF]/60 bg-[#E8DCEB] px-1.5 py-0.5 text-[9px] font-bold text-[#4A1D45] transition-colors hover:bg-[#dfd0e3] cursor-pointer"
                          title={`Click to switch between lb and kg (current: ${weightUnit})`}
                        >
                          <span>{weightUnit.toUpperCase()}</span>
                          <span className="ml-0.5 opacity-60">⇄</span>
                        </button>
                      </div>
                      <span className="text-center">REPS</span>
                    </div>
                  )}
                </div>

                {/* Set Rows */}
                <div className="space-y-2">
                  {ex.sets.map((set, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border-t-[1.5px] border-[#E8DCEB] dark:border-border pt-2.5"
                    >
                      <span className="w-6 text-center text-base font-bold text-[#4A1D45] dark:text-foreground shrink-0">
                        {i + 1}
                      </span>

                      {/* Interactive Fields (Zero keyboard, opens preset modal) */}
                      {isCardio ? (
                        <div className="grid flex-1 grid-flow-col auto-cols-fr gap-1.5 min-w-0">
                          <PresetField
                            value={set.time ?? set.reps ?? defaultDuration}
                            suffix={unit}
                            label="Duration"
                            onClick={() =>
                              openDurationPicker(
                                set.time ?? set.reps ?? defaultDuration,
                                unit as "min" | "sec",
                                (v) =>
                                  update((l) =>
                                    l.map((e) =>
                                      e.id === ex.id
                                        ? {
                                            ...e,
                                            sets: e.sets.map((z, j) =>
                                              j === i ? { ...z, time: v, reps: v, weight: 0 } : z
                                            ),
                                          }
                                        : e
                                    )
                                  )
                              )
                            }
                          />
                          {cardioConfigs.map((cfg) => {
                            const val = (set[cfg.key] as number | undefined) ?? cfg.defaultVal;
                            return (
                              <PresetField
                                key={cfg.key}
                                value={val}
                                suffix={cfg.suffix}
                                label={cfg.label}
                                onClick={() =>
                                  openCardioSettingPicker(cfg, val, (v) =>
                                    update((l) =>
                                      l.map((e) =>
                                        e.id === ex.id
                                          ? {
                                              ...e,
                                              sets: e.sets.map((z, j) =>
                                                j === i ? { ...z, [cfg.key]: v } : z
                                              ),
                                            }
                                          : e
                                      )
                                    )
                                  )
                                }
                              />
                            );
                          })}
                        </div>
                      ) : isDuration ? (
                        <PresetField
                          value={set.time ?? set.reps ?? defaultDuration}
                          suffix={unit}
                          label="Duration"
                          onClick={() =>
                            openDurationPicker(
                              set.time ?? set.reps ?? defaultDuration,
                              unit as "min" | "sec",
                              (v) =>
                                update((l) =>
                                  l.map((e) =>
                                    e.id === ex.id
                                      ? {
                                          ...e,
                                          sets: e.sets.map((z, j) =>
                                            j === i ? { ...z, time: v, reps: v, weight: 0 } : z
                                          ),
                                        }
                                      : e
                                  )
                                )
                            )
                          }
                        />
                      ) : (
                        <div className="flex flex-1 items-center gap-1.5 min-w-0">
                          <PresetField
                            value={set.weight}
                            suffix={weightUnit}
                            label="Weight"
                            onToggleUnit={() => toggleWeightUnit(ex.id)}
                            onClick={() =>
                              openWeightPicker(set.weight, weightUnit, (v) =>
                                update((l) =>
                                  l.map((e) =>
                                    e.id === ex.id
                                      ? {
                                          ...e,
                                          sets: e.sets.map((z, j) =>
                                            j === i ? { ...z, weight: v } : z
                                          ),
                                        }
                                      : e
                                  )
                                )
                              )
                            }
                          />
                          <PresetField
                            value={set.reps}
                            suffix="reps"
                            label="Reps"
                            onClick={() =>
                              openRepsPicker(set.reps, (v) =>
                                update((l) =>
                                  l.map((e) =>
                                    e.id === ex.id
                                      ? {
                                          ...e,
                                          sets: e.sets.map((z, j) =>
                                            j === i ? { ...z, reps: v } : z
                                          ),
                                        }
                                      : e
                                  )
                                )
                              )
                            }
                          />
                        </div>
                      )}

                      {/* Action buttons */}
                      <button
                        type="button"
                        aria-label={set.done ? "Mark set incomplete" : "Complete set"}
                        onClick={() => {
                          const nextDone = !set.done;
                          if (!nextDone) {
                            setOpenOverrides((prev) => ({ ...prev, [ex.id]: true }));
                          }
                          update((l) =>
                            l.map((e) =>
                              e.id === ex.id
                                ? {
                                    ...e,
                                    sets: e.sets.map((z, j) =>
                                      j === i ? { ...z, done: nextDone } : z
                                    ),
                                  }
                                : e
                            )
                          );
                        }}
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
                        onClick={() =>
                          update((l) =>
                            l.map((e) =>
                              e.id === ex.id
                                ? { ...e, sets: e.sets.filter((_, j) => j !== i) }
                                : e
                            )
                          )
                        }
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-none bg-[#E8DCEB] text-[#4A1D45] transition-colors hover:bg-[#dfd0e3]"
                      >
                        <X className="h-5 w-5 stroke-[2.2]" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pl-8 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      update((l) =>
                        l.map((e) => {
                          if (e.id !== ex.id) return e;
                          const lastSet = e.sets.at(-1);
                          const currentWeightUnit = e.weightUnit ?? "lb";
                          const defaultWeight = currentWeightUnit === "lb" ? 25 : 10;
                          const newSet = isCardio
                            ? {
                                weight: 0,
                                reps: lastSet?.time ?? defaultDuration,
                                time: lastSet?.time ?? defaultDuration,
                                speed: lastSet?.speed,
                                incline: lastSet?.incline,
                                resistance: lastSet?.resistance,
                                level: lastSet?.level,
                                cadence: lastSet?.cadence,
                                done: false,
                              }
                            : isDuration
                              ? {
                                  weight: 0,
                                  reps: lastSet?.time ?? lastSet?.reps ?? defaultDuration,
                                  time: lastSet?.time ?? lastSet?.reps ?? defaultDuration,
                                  done: false,
                                }
                              : {
                                  ...(lastSet ?? { weight: defaultWeight, reps: 10 }),
                                  done: false,
                                };
                          return { ...e, sets: [...e.sets, newSet] };
                        })
                      )
                    }
                    className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[18px] border-none bg-[#E8DCEB] text-sm font-bold text-[#4A1D45] transition-colors hover:bg-[#dfd0e3]"
                  >
                    + Set
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextDone = !allDone;
                      if (nextDone) {
                        // Collapse on complete all
                        setOpenOverrides((prev) => ({ ...prev, [ex.id]: false }));
                      } else {
                        setOpenOverrides((prev) => ({ ...prev, [ex.id]: true }));
                      }
                      update((l) =>
                        l.map((e) =>
                          e.id === ex.id
                            ? { ...e, sets: e.sets.map((z) => ({ ...z, done: nextDone })) }
                            : e
                        )
                      );
                    }}
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

      <Button
        type="button"
        onClick={() => setAdding(true)}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border py-4 font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground"
      >
        <Plus className="h-4 w-4" /> Add exercise
      </Button>

      <ExercisePickerModal
        isOpen={adding}
        onClose={() => setAdding(false)}
        title="Add Exercise to Workout"
        onSelect={(name) => add(name)}
      />

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
        onConfirm={handleFinishModalConfirm}
      />

      <PlanUpdateModal
        isOpen={showPlanUpdateModal}
        planName={originalPlan?.name ?? "Workout Plan"}
        addedExercises={addedExercises}
        removedExercises={removedExercises}
        onUpdatePlan={handleUpdatePlan}
        onSaveAsNewPlan={handleSaveAsNewPlan}
        onDiscardChanges={handleDiscardChanges}
      />

      <PresetPickerModal
        isOpen={pickerConfig.isOpen}
        title={pickerConfig.title}
        value={pickerConfig.value}
        suffix={pickerConfig.suffix}
        step={pickerConfig.step}
        presets={pickerConfig.presets}
        min={pickerConfig.min}
        max={pickerConfig.max}
        onSelect={pickerConfig.onSelect}
        onClose={() => setPickerConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

function PresetField({
  value,
  suffix,
  label,
  onClick,
  onToggleUnit,
}: {
  value: number;
  suffix: string;
  label?: string;
  onClick: () => void;
  onToggleUnit?: (() => void) | undefined;
}) {
  const formattedSuffix = suffix === "%" ? "%" : ` ${suffix}`;
  return (
    <div className="flex h-11 flex-1 min-w-0 items-center justify-between gap-1 rounded-2xl bg-[#F1EEE9] px-1.5 sm:px-2 text-[#4A1D45] transition-all hover:bg-[#eae5df] active:scale-[0.98]">
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center justify-center gap-0.5 min-w-0 py-1 text-center cursor-pointer outline-none"
        aria-label={label ? `${label}: ${value}${formattedSuffix}` : `${value}${formattedSuffix}`}
      >
        <span className="font-sans text-sm sm:text-base font-bold text-[#4A1D45] tabular-nums truncate">
          {value}
        </span>
        {!onToggleUnit && (
          <span className="shrink-0 text-[11px] sm:text-xs font-normal text-[#4A1D45]/75">
            {formattedSuffix}
          </span>
        )}
      </button>

      {onToggleUnit && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleUnit();
          }}
          title="Click to switch between lb and kg"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/80 text-[10px] font-bold text-[#4A1D45] shadow-xs transition-colors hover:bg-white cursor-pointer"
        >
          {suffix}
        </button>
      )}
    </div>
  );
}
