import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock3, Dumbbell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, type Session } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [
    { title:"Workout calendar — Bloom" },
    { name:"description",content:"See every workout and sport on a monthly calendar and open full exercise details." },
    { property:"og:title",content:"Workout calendar — Bloom" },
    { property:"og:description",content:"Your workouts, sports, sets, weights and reps by date." },
    { property:"og:type",content:"website" },
    { name:"twitter:card",content:"summary_large_image" },
  ] }), component: HistoryPage,
});

const WEEKDAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const dateKey=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

function HistoryPage(){
  const s=useStore();
  const latest=s.sessions.at(-1)?.date;
  const initial=latest ? new Date(`${latest}T12:00:00`) : new Date();
  const [month,setMonth]=useState(new Date(initial.getFullYear(),initial.getMonth(),1));
  const [selected,setSelected]=useState<Session|null>(null);
  const cells=useMemo(()=>{
    const first=new Date(month.getFullYear(),month.getMonth(),1);
    const start=new Date(first); start.setDate(1-first.getDay());
    return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d;});
  },[month]);
  const eventsByDate=useMemo(()=>s.sessions.reduce<Record<string,Session[]>>((all,event)=>{(all[event.date]??=[]).push(event);return all;},{}),[s.sessions]);
  const move=(offset:number)=>setMonth(new Date(month.getFullYear(),month.getMonth()+offset,1));
  return <div className="space-y-5 px-4 pt-10">
    <header><p className="text-sm text-muted-foreground">Every activity, in one place</p><h1 className="font-display text-4xl">History</h1></header>
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border p-3"><Button size="icon" variant="ghost" aria-label="Previous month" onClick={()=>move(-1)}><ChevronLeft /></Button><h2 className="font-semibold">{month.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2><Button size="icon" variant="ghost" aria-label="Next month" onClick={()=>move(1)}><ChevronRight /></Button></div>
      <div className="grid grid-cols-7 border-b border-border bg-muted/40">{WEEKDAYS.map(day=><div key={day} className="py-2 text-center text-[10px] font-semibold text-muted-foreground">{day.slice(0,1)}</div>)}</div>
      <div className="grid grid-cols-7">{cells.map((date,index)=>{const key=dateKey(date);const events=eventsByDate[key]??[];const inMonth=date.getMonth()===month.getMonth();return <div key={key} className={`min-h-20 border-b border-r border-border p-1 ${index%7===6?"border-r-0":""} ${inMonth?"":"bg-muted/30 text-muted-foreground"}`}><span className="text-[10px]">{date.getDate()}</span><div className="mt-1 space-y-1">{events.slice(0,2).map(event=><Button key={event.id} variant="ghost" onClick={()=>setSelected(event)} className="h-auto w-full justify-start overflow-hidden rounded-md bg-secondary px-1.5 py-1 text-left text-[9px] leading-tight text-secondary-foreground"><span className="truncate">{event.activity}</span></Button>)}</div></div>})}</div>
    </section>
    <p className="text-xs text-muted-foreground">Select an event to see its full details. Sample workouts are included to show your exercise trends.</p>
    {selected&&<SessionDetails session={selected} close={()=>setSelected(null)} />}
  </div>;
}

function SessionDetails({session,close}:{session:Session;close:()=>void}){
  return <div className="fixed inset-0 z-30 flex items-end justify-center bg-foreground/30 p-3" onClick={close}><article role="dialog" aria-modal="true" aria-label={`${session.activity} details`} className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-background p-5 shadow-soft" onClick={event=>event.stopPropagation()}>
    <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted-foreground">{new Date(`${session.date}T12:00`).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p><h2 className="font-display text-3xl">{session.flower} {session.activity}</h2>{session.sample&&<p className="mt-1 text-xs font-medium text-primary">Sample workout</p>}</div><Button size="icon" variant="ghost" aria-label="Close details" onClick={close}><X /></Button></div>
    <div className="mt-4 flex gap-4 border-y border-border py-3 text-sm text-muted-foreground">{session.completedAt&&<span className="flex items-center gap-1"><Clock3 className="h-4 w-4" />{new Date(session.completedAt).toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"})}</span>}{session.minutes!==undefined&&<span>{session.minutes} min</span>}</div>
    {session.exercises.length?<div className="divide-y divide-border">{session.exercises.map(ex=>{const maxWeight=Math.max(...ex.sets.map(set=>set.weight));const maxReps=Math.max(...ex.sets.map(set=>set.reps));return <section key={ex.id} className="py-4"><div className="flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 font-semibold"><Dumbbell className="h-4 w-4 text-primary" />{ex.name}</h3><span className="text-xs text-muted-foreground">{ex.sets.length} sets</span></div><p className="mt-1 text-sm">Max {maxWeight} kg · Max {maxReps} reps</p><p className="mt-2 text-xs text-muted-foreground">{ex.sets.map((set,index)=>`Set ${index+1}: ${set.weight} kg × ${set.reps}`).join(" · ")}</p></section>})}</div>:<p className="py-6 text-sm text-muted-foreground">No exercises recorded for this activity.</p>}
  </article></div>;
}