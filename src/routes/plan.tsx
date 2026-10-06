import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXERCISE_LIBRARY, setState, uid, useStore, type WorkoutPlan } from "@/lib/store";

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
  const [selected, setSelected] = useState<string | null>(null);
  const current = s.plans.find(plan => plan.id === selected);
  const save = (plan: WorkoutPlan) => setState(x => ({...x, plans:x.plans.map(p => p.id === plan.id ? plan : p)}));
  const createPlan = () => {
    const plan: WorkoutPlan = { id:uid(), name:"My new plan", items:[] };
    setState(x => ({...x, plans:[...x.plans, plan]}));
    setSelected(plan.id);
  };

  if (current) return <div className="space-y-5 px-5 pt-10">
    <Button variant="ghost" onClick={() => setSelected(null)}><ChevronLeft /> All plans</Button>
    <input aria-label="Plan name" value={current.name} onChange={e => save({...current,name:e.target.value})} className="w-full border-b border-input bg-transparent py-2 font-display text-3xl outline-none" />
    <p className="text-sm text-muted-foreground">{current.items.length} exercises</p>
    <div className="divide-y divide-border">{current.items.map((item,index) => <article key={`${item.name}-${index}`} className="space-y-3 py-4"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{item.name}</h2><Button variant="ghost" size="icon" aria-label={`Remove ${item.name}`} onClick={() => save({...current,items:current.items.filter((_,i)=>i!==index)})}><Trash2 /></Button></div><div className="grid grid-cols-3 gap-2">{(["sets","reps","weight"] as const).map(field => <label key={field} className="text-xs text-muted-foreground"><span>{field === "weight" ? "kg / level" : field}</span><input type="number" min={0} value={item[field]} onChange={e => save({...current,items:current.items.map((it,i)=>i===index?{...it,[field]:+e.target.value}:it)})} className="mt-1 w-full rounded-lg border border-input bg-card px-2 py-2 text-center text-foreground" /></label>)}</div></article>)}</div>
    <select aria-label="Add exercise" value="" onChange={e => { if(e.target.value) save({...current,items:[...current.items,{name:e.target.value,sets:3,reps:10,weight:10}]}); }} className="w-full rounded-xl border border-input bg-card px-3 py-3"><option value="">+ Add exercise</option>{EXERCISE_LIBRARY.filter(ex => !current.items.some(item=>item.name===ex.name)).map(ex=><option key={ex.name}>{ex.name}</option>)}</select>
    <Button variant="destructive" className="w-full" onClick={() => {setState(x=>({...x,plans:x.plans.filter(p=>p.id!==current.id)}));setSelected(null);}}><Trash2 /> Delete plan</Button>
  </div>;

  return <div className="space-y-5 px-5 pt-10"><div className="flex items-end justify-between"><div><p className="text-sm text-muted-foreground">Reusable routines</p><h1 className="font-display text-4xl">Plans</h1></div><Button size="icon" aria-label="Create plan" onClick={createPlan}><Plus /></Button></div><div className="space-y-3">{s.plans.map(plan=><Button key={plan.id} variant="ghost" onClick={()=>setSelected(plan.id)} className="h-auto w-full justify-between rounded-2xl bg-card p-4 text-left"><span><span className="block font-semibold">{plan.name}</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{plan.items.length} exercises</span></span><span className="text-muted-foreground">View</span></Button>)}</div></div>;
}