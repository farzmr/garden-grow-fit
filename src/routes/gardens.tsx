import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { GARDENS } from "@/components/Garden";
import { Button } from "@/components/ui/button";
import { FlowerIcon } from "@/components/FlowerIcon";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/gardens")({
  head: () => ({ meta: [
    { title: "Gardens — Bloom" },
    { name: "description", content: "Explore Bloom's illustrated gardens and choose the one shown on Home." },
    { property: "og:title", content: "Gardens — Bloom" },
    { property: "og:description", content: "Choose a handcrafted garden for your workout blooms." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Gardens,
});

function Gardens() {
  const state = useStore();
  return (
    <div className="space-y-6 px-5 pt-10">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase">Your collection</p>
        </div>
        <h1 className="font-display text-4xl">Gardens</h1>
        <p className="text-sm text-muted-foreground">Choose where your workout flowers will grow.</p>
      </header>
      <div className="space-y-5">
        {GARDENS.map((garden) => {
          const isMain = state.mainGarden === garden.id;
          const gardenSessions = state.sessions.filter(
            (s) => (s.gardenId ?? "wild-meadow") === garden.id,
          );
          return (
            <article key={garden.id} className="overflow-hidden rounded-2xl bg-card shadow-soft">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={garden.image}
                  alt={garden.alt}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* Flowers planted in this garden */}
                <div className="garden-flowers absolute grid grid-cols-6 grid-rows-4 items-end justify-items-center pointer-events-none">
                  {gardenSessions.slice(-24).map((s) => (
                    <span key={s.id} className="garden-flower flex items-center justify-center">
                      <span className="animate-sway flex items-center justify-center">
                        <FlowerIcon flower={s.flower} className="h-6 w-6 sm:h-8 sm:w-8 drop-shadow" />
                      </span>
                    </span>
                  ))}
                </div>
                {isMain && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
                    <Check className="h-3.5 w-3.5" /> Main
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl">{garden.name}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{garden.subtitle}</p>
                  </div>
                  <Button
                    variant={isMain ? "secondary" : "outline"}
                    disabled={isMain}
                    onClick={() => setState((current) => ({ ...current, mainGarden: garden.id }))}
                    className="shrink-0"
                  >
                    {isMain ? "Selected" : "Set main"}
                  </Button>
                </div>
                {/* Planted flowers count & preview */}
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                  {gardenSessions.length > 0 ? (
                    <>
                      <span className="font-medium text-foreground">
                        {gardenSessions.length} flower{gardenSessions.length === 1 ? "" : "s"} planted
                      </span>
                      <div className="flex items-center gap-1">
                        {gardenSessions.slice(-8).map((s) => (
                          <span key={s.id} title={`${s.activity} (${s.date})`}>
                            <FlowerIcon flower={s.flower} className="h-5 w-5" />
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No flowers planted in this garden yet
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}