import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Dumbbell, Bike, PersonStanding, Activity, Music2, Waves, StretchHorizontal, Plus, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLOWERS, planToExercises, setState, today, uid, useStore, type WorkoutPlan } from "@/lib/store";

export const Route = createFileRoute("/start")({
  head: () => ({ meta: [
    { title: "Plant & start a session — Bloom" },
    { name: "description", content: "Choose your flower, then a workout or sport for today." },
    { property: "og:title", content: "Plant & start a session — Bloom" },
    { property: "og:description", content: "Choose a flower and today's activity." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Start,
});
const sports = [
  { name: "Workout", icon: Dumbbell }, { name: "Yoga", icon: PersonStanding },
  { name: "Pilates", icon: Activity }, { name: "Spin", icon: Bike },
  { name: "Cardio", icon: Activity }, { name: "Dance", icon: Music2 },
  { name: "Stretching", icon: StretchHorizontal }, { name: "Swimming", icon: Waves },
  { name: "Other", icon: Plus },
];
function Start() {
  const s = useStore(); const nav = useNavigate();
  const [step, setStep] = useState<"flower" | "activity">("flower");
  const [flower, setFlower] = useState(s.flower);
  const [cls, setCls] = useState<string | null>(null);
  const [custom, setCustom] = useState(""); const [minutes, setMinutes] = useState(45);
  const [planted, setPlanted] = useState(false);
  const [replace, setReplace] = useState(false);
  const beginWorkout = (plan: WorkoutPlan) => {
    setState(x => ({ ...x, flower, activeFlower: flower, activePlanId: plan.id, activePlanName: plan.name, activeStartedAt: new Date().toISOString(), active: planToExercises(plan.items) }));
    nav({ to: "/workout" });
  };
  const finishClass = () => {
    const activity = cls === "Other" ? custom.trim() : cls;
    if (!activity) return;
    setState(x => ({ ...x, flower, sessions: [...x.sessions, { id: uid(), date: today(), completedAt: new Date().toISOString(), activity, minutes, exercises: [], flower }] }));
    setPlanted(true); setTimeout(() => nav({ to: "/" }), 1600);
  };
  if (planted) return <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center"><span className="animate-bloom text-7xl">{flower}</span><p className="font-display text-2xl">Planted in your garden!</p></div>;
  return <div className="space-y-6 px-5 pt-10">
    <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase text-muted-foreground">{step === "flower" ? "01 · Your flower" : "02 · Your activity"}</p><Flower2 className="h-5 w-5 text-primary" /></div>
    {step === "flower" ? <>
      <h1 className="font-display text-4xl">What will you plant?</h1>
      <div className="flex justify-center rounded-3xl bg-garden py-10"><span className="text-7xl">{flower}</span></div>
      <div className="grid grid-cols-4 gap-3">{FLOWERS.map(f => <Button key={f} variant="ghost" aria-label={`Choose ${f}`} aria-pressed={flower === f} onClick={() => setFlower(f)} className={`h-16 rounded-2xl text-3xl ${flower === f ? "bg-accent ring-2 ring-primary" : "bg-card"}`}>{f}</Button>)}</div>
      <Button className="h-14 w-full rounded-2xl text-base" onClick={() => setStep("activity")}>Next <ArrowRight /></Button>
    </> : <>
      <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Back to flowers" onClick={() => { setStep("flower"); setCls(null); setReplace(false); }}><ArrowLeft /></Button><span className="text-2xl">{flower}</span></div>
      <h1 className="font-display text-4xl">What are you doing today?</h1>
       {replace ? <section className="space-y-4 border-y border-border py-5"><h2 className="text-lg font-semibold">A workout is already in progress</h2><Button className="w-full" onClick={() => nav({ to: "/workout" })}>Resume existing workout</Button><Button variant="outline" className="w-full" onClick={() => { setState(x => ({...x, active:null, activeStartedAt:undefined, activeFlower:undefined, activePlanId:undefined, activePlanName:undefined})); setReplace(false); setCls("Workout"); }}>Discard it & choose a plan</Button><Button variant="ghost" className="w-full" onClick={() => setReplace(false)}>Back</Button></section> : !cls ?
         <div className="grid grid-cols-2 gap-3">{sports.map(({ name, icon: Icon }) => <Button key={name} variant={name === "Workout" ? "default" : "ghost"} onClick={() => name === "Workout" ? s.active !== null ? setReplace(true) : setCls("Workout") : setCls(name)} className={`h-auto min-h-24 flex-col items-start whitespace-normal rounded-2xl p-5 text-base ${name === "Workout" ? "col-span-2" : "bg-card"}`}><Icon className="!h-6 !w-6" />{name}{name === "Workout" && <span className="text-xs font-normal opacity-80">Choose from {s.plans.length} saved plan{s.plans.length === 1 ? "" : "s"}</span>}</Button>)}</div> : cls === "Workout" ?
         <section className="space-y-4"><div><h2 className="font-display text-2xl">Choose a plan</h2><p className="text-sm text-muted-foreground">Pick the routine you want to do today.</p></div><div className="space-y-3">{s.plans.map(plan => <Button key={plan.id} variant="ghost" onClick={() => beginWorkout(plan)} className="h-auto w-full items-start justify-between rounded-2xl bg-card p-4 text-left whitespace-normal"><span><span className="block font-semibold">{plan.name}</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{plan.items.length} exercises</span></span><ArrowRight className="mt-1 shrink-0" /></Button>)}</div><Button asChild variant="outline" className="w-full"><Link to="/plan">Manage plans</Link></Button><Button variant="ghost" className="w-full" onClick={() => setCls(null)}><ArrowLeft /> Back</Button></section> :
        <section className="space-y-5 border-y border-border py-5"><h2 className="text-xl font-semibold">{cls}</h2>{cls === "Other" && <label className="block text-sm">Activity name<input aria-label="Activity name" value={custom} onChange={e => setCustom(e.target.value)} placeholder="e.g. Badminton" maxLength={80} className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-3" /></label>}
        <label className="block text-sm text-muted-foreground">Duration <span className="font-semibold text-foreground">{minutes} min</span><input aria-label="Duration" type="range" min={10} max={120} step={5} value={minutes} onChange={e => setMinutes(+e.target.value)} className="mt-3 w-full accent-primary" /></label>
        <Button disabled={cls === "Other" && !custom.trim()} onClick={finishClass} className="h-14 w-full rounded-2xl">Done — plant my {flower}</Button><Button variant="ghost" className="w-full" onClick={() => setCls(null)}><ArrowLeft /> Back</Button></section>}
    </>}
  </div>;
}
