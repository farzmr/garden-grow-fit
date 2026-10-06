import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronRight, Dumbbell } from "lucide-react";
import { EXERCISE_LIBRARY, lastFor, useStore } from "@/lib/store";
export const Route = createFileRoute("/exercises")({ head: () => ({ meta: [
 {title:"Gym exercises — Bloom"},{name:"description",content:"Browse gym exercises and see your personal weight history for each."},
 {property:"og:title",content:"Gym exercises — Bloom"},{property:"og:description",content:"Your exercise library and individual lifting progress."},
 {property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"},
]}), component: Exercises });
function Exercises() {
 const s=useStore(); const [query,setQuery]=useState('');
 const names=[...new Set([...EXERCISE_LIBRARY.map(e=>e.name),...s.sessions.flatMap(x=>x.exercises.map(e=>e.name)),...Object.values(s.plan).flatMap(x=>x.map(e=>e.name))])].sort();
 const filtered=names.filter(n=>n.toLowerCase().includes(query.toLowerCase()));
 return <div className="space-y-5 px-5 pt-10"><h1 className="font-display text-4xl">Exercises</h1><label className="flex items-center gap-2 rounded-xl border border-input bg-card px-3"><Search className="h-4 w-4 text-muted-foreground" /><input aria-label="Search exercises" placeholder="Search exercises" value={query} onChange={e=>setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" /></label><p className="text-xs text-muted-foreground">{filtered.length} exercises</p><div className="divide-y divide-border">{filtered.map(name=>{const info=EXERCISE_LIBRARY.find(e=>e.name===name);const last=lastFor(s.sessions,name);return <Link key={name} to="/exercise/$name" params={{name}} className="flex items-center gap-3 py-3"><div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-card">{info?.image ? <img src={info.image} alt={name} width={64} height={64} loading="lazy" className="h-full w-full object-contain" /> : <Dumbbell className="h-6 w-6 text-muted-foreground" />}</div><div className="min-w-0 flex-1"><h2 className="break-words text-sm font-semibold">{name}</h2><p className="mt-1 text-xs text-muted-foreground">{last ? `${last.best} kg · ${last.date}` : 'Not trained yet'}</p></div><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /></Link>})}</div>{!filtered.length && <p className="py-6 text-center text-sm text-muted-foreground">No matching exercises.</p>}</div>;
}
