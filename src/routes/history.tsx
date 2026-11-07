import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { ChevronLeft, ChevronRight, Clock3, Dumbbell, MapPin, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowerIcon } from "@/components/FlowerIcon";
import { deleteSession, imageFor, useStore, type Session } from "@/lib/store";

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
  const move=(offset:number)=>{setMonth(new Date(month.getFullYear(),month.getMonth()+offset,1));setSelected(null);};
  return <div className="space-y-5 px-4 pt-10">
    <header><p className="text-sm text-muted-foreground">Every activity, in one place</p><h1 className="font-display text-4xl">History</h1></header>
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border p-3"><Button size="icon" variant="ghost" aria-label="Previous month" onClick={()=>move(-1)}><ChevronLeft /></Button><h2 className="font-semibold">{month.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2><Button size="icon" variant="ghost" aria-label="Next month" onClick={()=>move(1)}><ChevronRight /></Button></div>
      <div className="grid grid-cols-7 border-b border-border bg-muted/40">{WEEKDAYS.map(day=><div key={day} className="py-2 text-center text-[10px] font-semibold text-muted-foreground">{day.slice(0,1)}</div>)}</div>
      <div className="grid grid-cols-7">
        {cells.map((date, index) => {
          const key = dateKey(date);
          const events = eventsByDate[key] ?? [];
          const inMonth = date.getMonth() === month.getMonth();
          return (
            <div
              key={key}
              className={`min-h-20 border-b border-r border-border p-1 ${
                index % 7 === 6 ? "border-r-0" : ""
              } ${inMonth ? "" : "bg-muted/30 text-muted-foreground"}`}
            >
              <span className="text-[10px]">{date.getDate()}</span>
              <div className="mt-1 space-y-1">
                {events.slice(0, 2).map((event) => (
                  <Button
                    key={event.id}
                    variant="ghost"
                    onClick={() => setSelected(event)}
                    className="h-auto w-full justify-start overflow-hidden rounded-md bg-secondary px-1.5 py-1 text-left text-[9px] leading-tight text-secondary-foreground"
                  >
                    <span className="truncate">{event.activity}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
    {selected&&<SessionDetails session={selected} close={()=>setSelected(null)} />}
  </div>;
}

function SessionDetails({session,close}:{session:Session;close:()=>void}){
  const posthog = usePostHog();
  return <article role="region" aria-label={`${session.activity} details`} className="border-t-2 border-primary pb-3 pt-4">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{new Date(`${session.date}T12:00`).toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric",year:"numeric"})}</span>
        </p>
        <h2 className="mt-1 flex items-center gap-2 break-words font-display text-2xl">
          <FlowerIcon flower={session.flower} className="h-7 w-7" />
          <span>{session.planName ?? session.activity}</span>
        </h2>
        {session.sample&&<p className="mt-1 text-xs font-medium text-primary">Sample workout</p>}
      </div>
      <div className="flex items-center gap-1">
        {!session.sample && (
          <Button
            size="icon"
            variant="ghost"
            aria-label="Delete session"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => {
              posthog.capture("session_deleted", {
                exercise_count: session.exercises.length,
                duration_minutes: session.minutes,
              });
              deleteSession(session.id);
              close();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <Button size="icon" variant="ghost" aria-label="Close details" onClick={close}><X className="h-4 w-4" /></Button>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-border py-3 text-sm text-muted-foreground">
      {session.completedAt && (
        <span className="flex items-center gap-1.5">
          <Clock3 className="h-4 w-4" />
          <span>{new Date(session.completedAt).toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"})}</span>
        </span>
      )}
      {session.minutes!==undefined&&<span>{session.minutes} min</span>}
      {session.location&&<span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />{session.location}</span>}
      {session.feelingEmoji && (
        <span className="ml-auto text-xl leading-none" title="Feeling">{session.feelingEmoji}</span>
      )}
    </div>
    {(session.notes || session.intensity) && (
      <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-muted/50 p-3">
        <div className="min-w-0 flex-1">
          {session.intensity && (
            <span className="mb-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
              {session.intensity}
            </span>
          )}
          {session.notes && <p className="italic text-xs text-muted-foreground leading-relaxed">"{session.notes}"</p>}
        </div>
      </div>
    )}
    {session.exercises.length ? (
      <div className="divide-y divide-border">
        {session.exercises.map(ex => {
          const info = imageFor(ex.name);
          const isDuration = info?.trackingType === "duration";
          const unit = info?.timeUnit ?? "sec";
          const weightUnit = ex.weightUnit ?? "lb";
          const maxWeight = Math.max(0, ...ex.sets.map(set => set.weight));
          const maxReps = Math.max(0, ...ex.sets.map(set => set.reps));
          const maxTime = Math.max(0, ...ex.sets.map(set => set.time ?? set.reps ?? set.weight));
          return (
            <section key={ex.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                  <Dumbbell className="h-4 w-4 shrink-0 text-primary" />{ex.name}
                </h3>
                <span className="shrink-0 text-xs text-muted-foreground">{ex.sets.length} {ex.sets.length === 1 ? "set" : "sets"}</span>
              </div>
              <p className="mt-1 text-xs font-medium">
                {isDuration ? `Best: ${maxTime} ${unit}` : `Max ${maxWeight} ${weightUnit} · Max ${maxReps} reps`}
              </p>
              <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">
                {isDuration
                  ? ex.sets.map((set, index) => {
                      const parts = [`${set.time ?? set.reps ?? set.weight} ${unit}`];
                      if (set.speed !== undefined && set.speed > 0) parts.push(`${set.speed} mph`);
                      if (set.incline !== undefined && set.incline > 0) parts.push(`Incline ${set.incline}%`);
                      if (set.resistance !== undefined && set.resistance > 0) parts.push(`Res ${set.resistance}`);
                      if (set.level !== undefined && set.level > 0) parts.push(`Lvl ${set.level}`);
                      if (set.cadence !== undefined && set.cadence > 0) parts.push(`${set.cadence} rpm`);
                      return `Set ${index + 1}: ${parts.join(" · ")}`;
                    }).join(" · ")
                  : ex.sets.map((set, index) => `Set ${index + 1}: ${set.weight} ${weightUnit} × ${set.reps}`).join(" · ")}
              </p>
            </section>
          );
        })}
      </div>
    ) : session.activity === "Workout" ? (
      <p className="py-4 text-sm text-muted-foreground">No exercises recorded for this activity.</p>
    ) : null}
  </article>;
}