import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Bike,
  PersonStanding,
  Activity,
  Music2,
  Waves,
  StretchHorizontal,
  Plus,
  Flower2,
  Play,
  Timer,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowerIcon, FLOWER_CATALOG } from "@/components/FlowerIcon";
import { InspirationalBanner } from "@/components/InspirationalBanner";
import { FLOWERS, planToExercises, setState, useStore, type WorkoutPlan } from "@/lib/store";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Plant & start a session — Bloom" },
      { name: "description", content: "Choose your flower, then a workout or sport for today." },
      { property: "og:title", content: "Plant & start a session — Bloom" },
      { property: "og:description", content: "Choose a flower and today's activity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Start,
});

const sports = [
  { name: "Workout", icon: Dumbbell },
  { name: "Yoga", icon: PersonStanding },
  { name: "Pilates", icon: Activity },
  { name: "Spin", icon: Bike },
  { name: "Cardio", icon: Activity },
  { name: "Dance", icon: Music2 },
  { name: "Stretching", icon: StretchHorizontal },
  { name: "Swimming", icon: Waves },
  { name: "Other", icon: Plus },
];

const PRESET_MINUTES = [30, 45, 60] as const;

function Start() {
  const s = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState<"flower" | "activity">("flower");
  const [flower, setFlower] = useState(s.flower);
  const [cls, setCls] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [mode, setMode] = useState<"live" | "quick">("live");
  const [minutes, setMinutes] = useState<number>(45);
  const [customMinutes, setCustomMinutes] = useState<string>("75");
  const [isCustomActive, setIsCustomActive] = useState(false);
  const [replace, setReplace] = useState(false);

  const beginWorkout = (plan: WorkoutPlan) => {
    setState((x) => ({
      ...x,
      flower,
      activeFlower: flower,
      activePlanId: plan.id,
      activePlanName: plan.name,
      activeActivity: "Workout",
      activeLocation: undefined,
      activeStartedAt: new Date().toISOString(),
      active: planToExercises(plan.items, x.sessions),
    }));
    void nav({ to: "/workout" });
  };

  const startLiveClass = () => {
    const activity = cls === "Other" ? custom.trim() : cls;
    if (!activity) return;
    setState((x) => ({
      ...x,
      flower,
      activeFlower: flower,
      activeActivity: activity,
      activeLocation: undefined,
      activeTargetMinutes: undefined,
      activeStartedAt: new Date().toISOString(),
      active: [],
    }));
    void nav({ to: "/activity" });
  };

  const startQuickClass = () => {
    const activity = cls === "Other" ? custom.trim() : cls;
    if (!activity) return;
    const chosenMinutes = isCustomActive ? parseInt(customMinutes) || 45 : minutes;
    setState((x) => ({
      ...x,
      flower,
      activeFlower: flower,
      activeActivity: activity,
      activeLocation: undefined,
      activeTargetMinutes: chosenMinutes,
      activeStartedAt: new Date().toISOString(),
      active: [],
    }));
    void nav({ to: "/" });
  };

  const handleSelectPreset = (m: number) => {
    setMinutes(m);
    setIsCustomActive(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomMinutes(val);
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) {
      setMinutes(num);
    }
    setIsCustomActive(true);
  };

  const activityTitle = cls === "Other" ? custom.trim() || "Activity" : cls ?? "Activity";
  const displayMinutes = isCustomActive ? parseInt(customMinutes) || 45 : minutes;

  return (
    <div className={`px-5 ${step === "flower" ? "space-y-3 pt-5" : "space-y-6 pt-10"}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {step === "flower" ? "01 · Your flower" : "02 · Your activity"}
        </p>
        <Flower2 className="h-5 w-5 text-primary" />
      </div>

      {step === "flower" ? (
        <>
          <h1 className="font-display text-2xl font-bold">What will you plant?</h1>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-garden/40 py-2.5 px-4 shadow-xs overflow-hidden min-h-[96px]">
            <div key={flower} className="animate-bloom-in flex items-center justify-center">
              <FlowerIcon flower={flower} className="h-14 w-14 drop-shadow-sm animate-sway" />
            </div>
            <p className="mt-1 text-xs font-semibold text-primary capitalize">
              {FLOWER_CATALOG.find((m) => m.id === flower)?.name ?? flower}
            </p>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {FLOWERS.map((f) => {
              const meta = FLOWER_CATALOG.find((m) => m.id === f);
              const isSelected = flower === f;
              return (
                <Button
                  key={f}
                  variant="ghost"
                  aria-label={`Choose ${meta?.name ?? f}`}
                  aria-pressed={isSelected}
                  onClick={() => setFlower(f)}
                  className={`flex h-15 flex-col items-center justify-between rounded-xl p-1 transition-all [&_svg]:!size-full ${
                    isSelected
                      ? "bg-accent ring-2 ring-primary scale-105 shadow-xs"
                      : "bg-card hover:bg-muted/50"
                  }`}
                >
                  <FlowerIcon flower={f} className="h-7 w-7 drop-shadow-xs" />
                  <span className="truncate max-w-full px-0.5 text-[10px] font-medium leading-none text-foreground/85">
                    {meta?.name ?? f}
                  </span>
                </Button>
              );
            })}
          </div>
          <Button
            className="h-12 w-full rounded-xl text-base font-semibold shadow-soft"
            onClick={() => setStep("activity")}
          >
            Next <ArrowRight />
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Back to flowers"
              onClick={() => {
                setStep("flower");
                setCls(null);
                setReplace(false);
              }}
            >
              <ArrowLeft />
            </Button>
            <span className="text-2xl">{flower}</span>
          </div>

          <h1 className="font-display text-4xl">What are you doing today?</h1>

          {replace ? (
            <section className="space-y-4 border-y border-border py-5">
              <h2 className="text-lg font-semibold">An activity is already in progress</h2>
              <Button
                className="w-full"
                onClick={() =>
                  void nav({
                    to: s.activeActivity && s.activeActivity !== "Workout" ? "/activity" : "/workout",
                  })
                }
              >
                Resume existing session
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setState((x) => ({
                    ...x,
                    active: null,
                    activeStartedAt: undefined,
                    activeFlower: undefined,
                    activePlanId: undefined,
                    activePlanName: undefined,
                    activeActivity: undefined,
                    activeLocation: undefined,
                    activeTargetMinutes: undefined,
                  }));
                  setReplace(false);
                  setCls("Workout");
                }}
              >
                Discard it & start new
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setReplace(false)}>
                Back
              </Button>
            </section>
          ) : !cls ? (
            /* Sports selection grid — NO inspirational note here as requested */
            <div className="grid grid-cols-2 gap-3">
              {sports.map(({ name, icon: Icon }) => (
                <Button
                  key={name}
                  variant={name === "Workout" ? "default" : "ghost"}
                  onClick={() => {
                    if (s.activeStartedAt) {
                      setReplace(true);
                    } else {
                      setCls(name);
                    }
                  }}
                  className={`h-auto min-h-24 flex-col items-start whitespace-normal rounded-2xl p-5 text-base ${
                    name === "Workout" ? "col-span-2" : "bg-card"
                  }`}
                >
                  <Icon className="!h-6 !w-6" />
                  {name}
                  {name === "Workout" && (
                    <span className="text-xs font-normal opacity-80">
                      Choose from {s.plans.length} saved plan{s.plans.length === 1 ? "" : "s"}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          ) : cls === "Workout" ? (
            /* ONLY shown after clicking Workout */
            <section className="space-y-4">
              <InspirationalBanner />

              <div>
                <h2 className="font-display text-2xl">Choose a plan</h2>
                <p className="text-sm text-muted-foreground">Pick the routine you want to do today.</p>
              </div>

              <div className="space-y-3">
                {s.plans.map((plan) => (
                  <Button
                    key={plan.id}
                    variant="ghost"
                    onClick={() => beginWorkout(plan)}
                    className="h-auto w-full items-start justify-between rounded-2xl bg-card p-4 text-left whitespace-normal"
                  >
                    <span>
                      <span className="block font-semibold">{plan.name}</span>
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">
                        {plan.items.length} exercises
                      </span>
                    </span>
                    <ArrowRight className="mt-1 shrink-0" />
                  </Button>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/plan">Manage plans</Link>
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setCls(null)}>
                <ArrowLeft /> Back
              </Button>
            </section>
          ) : (
            /* ONLY shown after clicking non-workout exercise type (Yoga, Pilates, etc.) */
            <section className="space-y-5 border-y border-border py-5">
              <InspirationalBanner />

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{cls}</h2>
                <span className="text-2xl">{flower}</span>
              </div>

              {cls === "Other" && (
                <label className="block text-sm">
                  Activity name
                  <input
                    aria-label="Activity name"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="e.g. Badminton, Cycling, Trail run..."
                    maxLength={80}
                    className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-3"
                  />
                </label>
              )}

              {/* Mode Selector: Live Track vs Quick Log */}
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setMode("live")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    mode === "live"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Timer className="h-4 w-4" />
                  Track Live
                </button>
                <button
                  type="button"
                  onClick={() => setMode("quick")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    mode === "quick"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  Quick Log
                </button>
              </div>

              {/* Duration Presets EXACTLY below Quick Log */}
              {mode === "quick" && (
                <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Target Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_MINUTES.map((m) => {
                      const isSelected = !isCustomActive && minutes === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleSelectPreset(m)}
                          className={`flex h-12 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "border border-border bg-muted/50 text-foreground hover:bg-muted"
                          }`}
                        >
                          {m}m
                        </button>
                      );
                    })}

                    {/* Custom duration box next to 60m */}
                    <div
                      className={`relative flex h-12 items-center justify-center rounded-xl border transition-all ${
                        isCustomActive
                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                          : "border-border bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={customMinutes}
                        onFocus={() => setIsCustomActive(true)}
                        onChange={handleCustomChange}
                        className="w-8 bg-transparent text-center text-sm font-bold text-foreground outline-none"
                        placeholder="75"
                      />
                      <span className="text-[11px] font-semibold text-muted-foreground">m</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Will automatically complete in {displayMinutes} min unless cancelled on Home.
                  </p>
                </div>
              )}

              {/* Action Button: Both say Start! */}
              <div className="pt-2">
                {mode === "live" ? (
                  <Button
                    disabled={cls === "Other" && !custom.trim()}
                    onClick={startLiveClass}
                    className="h-14 w-full gap-2 rounded-2xl text-base font-semibold shadow-soft"
                  >
                    <Play className="h-5 w-5" />
                    Start {activityTitle}
                  </Button>
                ) : (
                  <Button
                    disabled={cls === "Other" && !custom.trim()}
                    onClick={startQuickClass}
                    className="h-14 w-full gap-2 rounded-2xl text-base font-semibold shadow-soft"
                  >
                    <Play className="h-5 w-5" />
                    Start {activityTitle} ({displayMinutes} min)
                  </Button>
                )}
              </div>

              <Button variant="ghost" className="w-full" onClick={() => setCls(null)}>
                <ArrowLeft /> Back to activities
              </Button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
