import { useState } from "react";
import wildMeadow from "@/assets/garden-wild-meadow.jpg";
import moonOrchard from "@/assets/garden-moon-orchard.jpg";
import glasshouse from "@/assets/garden-glasshouse.jpg";
import { Button } from "@/components/ui/button";
import { FlowerIcon } from "@/components/FlowerIcon";
import type { GardenId, Session } from "@/lib/store";

export const GARDENS: { id: GardenId; name: string; subtitle: string; image: string; alt: string }[] = [
  { id: "wild-meadow", name: "Wild Meadow", subtitle: "Sunlit lawn · silver birch · open clearing", image: wildMeadow, alt: "A cozy storybook illustration of a sunlit wildflower meadow with open lawn" },
  { id: "moon-orchard", name: "Moon Orchard", subtitle: "Moonlit grass · starry sky · peaceful pond", image: moonOrchard, alt: "A cozy storybook illustration of a nocturnal orchard clearing under the crescent moon" },
  { id: "glasshouse", name: "Willow Glasshouse", subtitle: "Sunbeams · white arches · conservatory lawn", image: glasshouse, alt: "A cozy storybook illustration of an airy glasshouse conservatory with open lawn" },
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
        {visible.map(session => (
          <Button
            key={session.id}
            variant="ghost"
            aria-label={`${session.activity} flower, ${session.date}`}
            aria-pressed={selected === session.id}
            title={`${session.date} · ${session.activity}`}
            onClick={() => setSelected(selected === session.id ? null : session.id)}
            className="garden-flower h-full w-full bg-transparent p-0 hover:bg-transparent"
          >
            <span className="animate-sway flex items-center justify-center">
              <FlowerIcon flower={session.flower} className="h-7 w-7 sm:h-9 sm:w-9 drop-shadow" />
            </span>
          </Button>
        ))}
      </div>
      {!sessions.length && <p className="absolute inset-x-12 top-[46%] text-center text-sm font-medium text-garden-foreground">A little space for<br />your next bloom.</p>}
    </div>
    <div className="min-h-10 text-center" aria-live="polite">
      {flower ? (
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <FlowerIcon flower={flower.flower} className="h-4 w-4" />
          <span>{flower.planName ?? flower.activity} · {new Date(`${flower.date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">{sessions.length} flower{sessions.length === 1 ? "" : "s"} planted</p>
      )}
    </div>
  </section>;
}