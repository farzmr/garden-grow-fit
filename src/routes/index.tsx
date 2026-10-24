import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, ArrowRight, Play, X, Clock3 } from "lucide-react";
import { Garden } from "@/components/Garden";
import { Button } from "@/components/ui/button";
import { AccountCard } from "@/components/AccountCard";
import { setState, streak, useStore } from "@/lib/store";
export const Route = createFileRoute("/")({
 head: () => ({ meta: [
 { title: "Bloom — Your gym garden" }, { name: "description", content: "Your flower garden, training streak, recent activity and today's workout." },
 { property: "og:title", content: "Bloom — Your gym garden" }, { property: "og:description", content: "Every workout grows your garden. Resume your session or start a new one." },
 { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
 ] }), component: Home,
});
function Home() {
 const s = useStore(); const personalSessions = s.sessions.filter(session => !session.sample); const st = streak(personalSessions); const [cancel, setCancel] = useState(false);
 const last = personalSessions.at(-1);
 const completed = s.active?.reduce((n,e) => n + e.sets.filter(z => z.done).length, 0) ?? 0;
 return <div className="space-y-6 px-5 pt-10">
 <header className="flex items-end justify-between gap-2"><div><p className="text-sm text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p><h1 className="font-display text-4xl">Your garden</h1></div><div className="flex shrink-0 items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-accent-foreground"><Flame className="h-4 w-4" /><span className="font-semibold">{st}</span><span className="text-xs">day{st === 1 ? "" : "s"}</span></div></header>
 <Garden sessions={personalSessions} gardenId={s.mainGarden} />
 <Button asChild className="h-16 w-full rounded-2xl text-lg"><Link to="/start">Start<ArrowRight /></Link></Button>
 {s.active !== null && <section className="space-y-3 border-y border-border py-4"><h2 className="font-semibold">Workout in progress</h2><p className="text-sm text-muted-foreground">{s.activePlanName ? `${s.activePlanName} · ` : ""}{s.active.length} exercises · {completed} sets completed</p>{s.activeStartedAt && <p className="text-xs text-muted-foreground">Started {new Date(s.activeStartedAt).toLocaleString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</p>}{cancel ? <><p className="text-sm">Discard this unfinished workout?</p><div className="flex gap-2"><Button className="flex-[2]" variant="outline" onClick={() => setCancel(false)}>Keep it</Button><Button className="flex-1" variant="destructive" onClick={() => { setState(x => ({...x,active:null,activeStartedAt:undefined,activeFlower:undefined,activePlanId:undefined,activePlanName:undefined}));setCancel(false); }}>Discard</Button></div></> : <div className="flex gap-2"><Button asChild variant="secondary" className="flex-[2]"><Link to="/workout"><Play /> Resume</Link></Button><Button variant="outline" className="flex-1" onClick={() => setCancel(true)}><X /> Cancel</Button></div>}</section>}
 <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="font-display text-xl">Last activity</h2><Link to="/history" className="text-xs font-medium text-primary">View history</Link></div>{last ? <div className="flex gap-3 rounded-2xl bg-card p-4 shadow-soft"><span className="text-3xl">{last.flower}</span><div className="min-w-0"><p className="break-words font-semibold">{last.activity}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(last.completedAt ?? last.date+"T12:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"})}{last.completedAt ? ` · ${new Date(last.completedAt).toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"})}` : " · Time not recorded"}</p><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3 w-3" />{last.minutes !== undefined ? `${last.minutes} min` : "Duration not recorded"}{last.exercises.length > 0 && ` · ${last.exercises.length} exercises`}</p></div></div> : <p className="text-sm text-muted-foreground">No activities yet.</p>}</section>
  <AccountCard />
  </div>;
}
