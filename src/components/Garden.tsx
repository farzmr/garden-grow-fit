import { useState } from "react";
import garden from "@/assets/garden-diorama.jpg";
import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/store";

export function Garden({ sessions }: { sessions: Session[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const flower = sessions.find(session => session.id === selected);
  const visible = sessions.slice(-24);
  return <section aria-label="Your flower garden" className="space-y-2">
    <div className="garden-scene relative aspect-square w-full overflow-hidden">
      <img src={garden} alt="A miniature garden with a green lawn, leafy trees and a little watering can" width={1024} height={1024} fetchPriority="high" className="h-full w-full object-cover" />
      <div className="garden-flowers absolute grid grid-cols-6 grid-rows-4 items-end justify-items-center">
        {visible.map(session => <Button key={session.id} variant="ghost" aria-label={`${session.activity} flower, ${session.date}`} aria-pressed={selected === session.id} title={`${session.date} · ${session.activity}`} onClick={() => setSelected(selected === session.id ? null : session.id)} className="garden-flower h-full w-full bg-transparent p-0 text-2xl hover:bg-transparent sm:text-3xl"><span className="animate-sway">{session.flower}</span></Button>)}
      </div>
      {!sessions.length && <p className="absolute inset-x-12 top-[46%] text-center text-sm font-medium text-garden-foreground">A little space for<br />your next bloom.</p>}
    </div>
    <div className="min-h-10 text-center" aria-live="polite">{flower ? <p className="text-xs text-muted-foreground">{flower.flower} {flower.planName ?? flower.activity}<br />{new Date(`${flower.date}T12:00:00`).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</p> : <p className="text-sm text-muted-foreground">{sessions.length} flower{sessions.length === 1 ? "" : "s"} planted</p>}</div>
  </section>;
}