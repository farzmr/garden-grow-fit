import { useState } from "react";
import wildMeadow from "@/assets/garden-wild-meadow.jpg";
import moonOrchard from "@/assets/garden-moon-orchard.jpg";
import glasshouse from "@/assets/garden-glasshouse.jpg";
import { Button } from "@/components/ui/button";
import type { GardenId, Session } from "@/lib/store";

export const GARDENS: { id: GardenId; name: string; subtitle: string; image: string; alt: string }[] = [
  { id: "wild-meadow", name: "Wild Meadow", subtitle: "Silver birch · cosmos · foxgloves", image: wildMeadow, alt: "A handcrafted wildflower meadow with a silver birch, cosmos and foxgloves" },
  { id: "moon-orchard", name: "Moon Orchard", subtitle: "Magnolias · plum trees · water lilies", image: moonOrchard, alt: "A moonlit handcrafted orchard with magnolia and plum trees around a reflective pond" },
  { id: "glasshouse", name: "Willow Glasshouse", subtitle: "Willow · climbing roses · eucalyptus", image: glasshouse, alt: "A handcrafted glasshouse garden with a willow, climbing roses and eucalyptus" },
];

export function Garden({ sessions, gardenId = "wild-meadow" }: { sessions: Session[]; gardenId?: GardenId }) {
  const [selected, setSelected] = useState<string | null>(null);
  const flower = sessions.find(session => session.id === selected);
  const visible = sessions.slice(-24);
  const garden = GARDENS.find(item => item.id === gardenId) ?? GARDENS[0];
  if (!garden) return null;
  return <section aria-label="Your flower garden" className="space-y-2">
    <div className="garden-scene relative aspect-square w-full overflow-hidden">
      <img src={garden.image} alt={garden.alt} width={1024} height={1024} fetchPriority="high" className="h-full w-full object-cover" />
      <div className="garden-flowers absolute grid grid-cols-6 grid-rows-4 items-end justify-items-center">
        {visible.map(session => <Button key={session.id} variant="ghost" aria-label={`${session.activity} flower, ${session.date}`} aria-pressed={selected === session.id} title={`${session.date} · ${session.activity}`} onClick={() => setSelected(selected === session.id ? null : session.id)} className="garden-flower h-full w-full bg-transparent p-0 text-2xl hover:bg-transparent sm:text-3xl"><span className="animate-sway">{session.flower}</span></Button>)}
      </div>
      {!sessions.length && <p className="absolute inset-x-12 top-[46%] text-center text-sm font-medium text-garden-foreground">A little space for<br />your next bloom.</p>}
    </div>
    <div className="min-h-10 text-center" aria-live="polite">{flower ? <p className="text-xs text-muted-foreground">{flower.flower} {flower.planName ?? flower.activity}<br />{new Date(`${flower.date}T12:00:00`).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</p> : <p className="text-sm text-muted-foreground">{sessions.length} flower{sessions.length === 1 ? "" : "s"} planted</p>}</div>
  </section>;
}